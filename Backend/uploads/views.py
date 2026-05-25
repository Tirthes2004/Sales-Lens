from django.utils import timezone
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from services.etl_service import process_sales_file
from services.s3_service import upload_file_to_s3
from services.snowflake_service import create_sales_table, insert_sales_rows

from .models import SalesUpload
from .serializers import FileUploadSerializer, SalesUploadSerializer


from io import BytesIO

class FileUploadView(GenericAPIView):
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = FileUploadSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        uploaded_file = serializer.validated_data["file"]
        file_type = uploaded_file.name.rsplit(".", 1)[-1].lower()

        upload = SalesUpload.objects.create(
            original_filename=uploaded_file.name,
            file_type=file_type,
            s3_key="",
            status="uploaded",
        )

        try:
            # Read file once
            file_bytes = uploaded_file.read()

            # ---------------------------
            # Upload to S3
            # ---------------------------
            s3_file = BytesIO(file_bytes)
            s3_file.name = uploaded_file.name

            s3_result = upload_file_to_s3(
                s3_file,
                upload.id,
                uploaded_file.name
            )

            upload.s3_key = s3_result["key"]
            upload.s3_url = s3_result["url"]

            upload.save(update_fields=["s3_key", "s3_url"])

            # ---------------------------
            # Process file using Pandas
            # ---------------------------
            processing_file = BytesIO(file_bytes)
            processing_file.name = uploaded_file.name

            cleaned_dataframe = process_sales_file(
                processing_file,
                file_type
            )

            # ---------------------------
            # Snowflake operations
            # ---------------------------
            create_sales_table()
            insert_sales_rows(cleaned_dataframe)

            upload.status = "processed"
            upload.rows_processed = len(cleaned_dataframe)
            upload.processed_at = timezone.now()

            upload.save(
                update_fields=[
                    "status",
                    "rows_processed",
                    "processed_at"
                ]
            )

            return Response(
                {
                    "message": "File uploaded successfully",
                    "rows_processed": len(cleaned_dataframe),
                    "s3_url": upload.s3_url,
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as exc:
            upload.status = "failed"
            upload.error_message = str(exc)

            upload.save(
                update_fields=["status", "error_message"]
            )

            return Response(
                {
                    "message": "File upload failed during processing.",
                    "error": str(exc),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )    
class UploadListView(APIView):
    def get(self, request):
        uploads = SalesUpload.objects.all()
        serializer = SalesUploadSerializer(uploads, many=True)
        return Response(serializer.data)
