from django.db import models


class SalesUpload(models.Model):
    STATUS_CHOICES = [
        ("uploaded", "Uploaded"),
        ("processed", "Processed"),
        ("failed", "Failed"),
    ]

    original_filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=10)
    s3_key = models.CharField(max_length=500)
    s3_url = models.URLField(max_length=1000, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="uploaded")
    rows_processed = models.PositiveIntegerField(default=0)
    error_message = models.TextField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return self.original_filename
