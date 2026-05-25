from django.urls import path

from .views import FileUploadView, UploadListView


urlpatterns = [
    path("upload/", FileUploadView.as_view(), name="file-upload"),
    path("uploads/", UploadListView.as_view(), name="upload-list"),
]
