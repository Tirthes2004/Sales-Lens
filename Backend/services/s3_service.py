from uuid import uuid4

import boto3
from django.conf import settings


def upload_file_to_s3(file_obj, upload_id, filename):
    """Upload the raw file to S3 and return its object key and URL."""
    extension = filename.rsplit(".", 1)[-1].lower()
    key = f"sales-uploads/{upload_id}/{uuid4()}.{extension}"
    content_type = getattr(file_obj, "content_type", "application/octet-stream")

    file_obj.seek(0)

    s3_client = boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME,
    )

    s3_client.upload_fileobj(
        file_obj,
        settings.AWS_STORAGE_BUCKET_NAME,
        key,
        ExtraArgs={"ContentType": content_type or "application/octet-stream"},
    )

    url = (
        f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3."
        f"{settings.AWS_S3_REGION_NAME}.amazonaws.com/{key}"
    )
    return {"key": key, "url": url}
