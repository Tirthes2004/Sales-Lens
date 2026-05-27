from django.contrib import admin

from .models import SalesUpload


@admin.register(SalesUpload)
class SalesUploadAdmin(admin.ModelAdmin):
    list_display = (
        "original_filename",
        "file_type",
        "status",
        "rows_processed",
        "uploaded_at",
        "processed_at",
    )
    list_filter = ("status", "file_type", "uploaded_at")
    search_fields = ("original_filename", "s3_key", "s3_url")
    readonly_fields = (
        "original_filename",
        "file_type",
        "s3_key",
        "s3_url",
        "status",
        "rows_processed",
        "error_message",
        "uploaded_at",
        "processed_at",
    )
