from rest_framework import serializers

from .models import SalesUpload


class SalesUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesUpload
        fields = [
            "id",
            "original_filename",
            "file_type",
            "s3_key",
            "s3_url",
            "status",
            "rows_processed",
            "error_message",
            "uploaded_at",
            "processed_at",
        ]
        read_only_fields = fields


class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, file):
        allowed_extensions = [".csv", ".xlsx"]
        filename = file.name.lower()

        if not any(filename.endswith(ext) for ext in allowed_extensions):
            raise serializers.ValidationError("Only CSV and XLSX files are allowed.")

        return file
