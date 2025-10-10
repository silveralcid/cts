import uuid
import mimetypes
from django.db import models
from django.core.exceptions import ValidationError

mimetypes.add_type("text/markdown", ".md")


def validate_file_type(value):
    """Allow only PDF, Markdown, or plain text files."""
    allowed_mime_types = [
        "application/pdf",
        "text/plain",
        "text/markdown",
    ]
    mime_type, _ = mimetypes.guess_type(value.name)
    if mime_type not in allowed_mime_types:
        raise ValidationError(
            f"Unsupported file type: {mime_type or 'unknown'}")


class Attachment(models.Model):
    """Generic attachment model for jobs (resume, job details, or other documents)."""

    TYPE_CHOICES = [
        ("resume", "Resume"),
        ("job_details", "Job Details"),
        ("other_document", "Other Document"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job = models.ForeignKey(
        "Job", on_delete=models.CASCADE, related_name="attachments")

    type = models.CharField(
        max_length=32,
        choices=TYPE_CHOICES,
        default="other_document",
        help_text="Categorize this file as a resume, job details, or other document.",
    )

    file = models.FileField(
        upload_to="attachments/",
        validators=[validate_file_type],
        help_text="Upload a PDF, Markdown (.md), or Text (.txt) file.",
    )

    filename = models.CharField(max_length=255, blank=True)
    mime_type = models.CharField(max_length=100, blank=True)
    size_bytes = models.PositiveIntegerField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]
        verbose_name = "attachment"
        verbose_name_plural = "attachments"

    def save(self, *args, **kwargs):
        """Auto-fill metadata fields on save."""
        if self.file:
            self.filename = self.file.name
            self.size_bytes = getattr(self.file, "size", None)
            mime_type, _ = mimetypes.guess_type(self.file.name)
            self.mime_type = mime_type or "unknown"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.type.title()} ({self.filename or 'unnamed'})"
