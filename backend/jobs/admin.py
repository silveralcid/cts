from django.contrib import admin
from django.core.files.base import ContentFile
from django.db import transaction
from jobs.models import Company, Job, Attachment
from jobs.fetchers import fetch_job_post_html
import mimetypes
import traceback


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("name", "industry", "size",
                    "is_nonprofit", "founding_year")
    search_fields = ("name", "industry")
    list_filter = ("is_nonprofit", "size", "stage")
    ordering = ("name",)


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = (
        "position_title",
        "company",
        "status",
        "priority",
        "is_remote",
        "date_posted",
    )
    search_fields = ("position_title", "company__name")
    list_filter = ("status", "is_remote", "employment_type", "role_type")
    ordering = ("-priority",)

    actions = ["fetch_job_post"]

    def fetch_job_post(self, request, queryset):
        """Admin action: fetch job post HTML and save it as an attachment."""
        for job in queryset:
            if not job.job_post_url:
                self.message_user(request, f"{job} has no job_post_url set.")
                continue

            try:
                html = fetch_job_post_html(job.job_post_url)
                filename = (
                    f"{job.company.name or 'unknown'}-{job.position_title}.html"
                ).replace(" ", "_")

                # Determine MIME type
                mime_type, _ = mimetypes.guess_type(filename)
                if mime_type != "text/html":
                    mime_type = "text/html"

                print(
                    f"Fetched {len(html)} bytes from {job.job_post_url} [{mime_type}]")

                # Remove old job_post attachments for this job
                Attachment.objects.filter(job=job, type="job_post").delete()

                # Save file and record atomically
                with transaction.atomic():
                    content = ContentFile(html.encode("utf-8"), name=filename)
                    attachment = Attachment(job=job, type="job_post")
                    attachment.file.save(filename, content, save=False)
                    attachment.mime_type = mime_type
                    attachment.save()

                print(f"✅ Saved attachment: {attachment.file.name}")

                self.message_user(
                    request,
                    f"✅ Saved job post HTML ({len(html)} bytes) for "
                    f"'{job.position_title}' at {job.company.name}.",
                )

            except Exception as e:
                print("❌ Error saving job post attachment:\n",
                      traceback.format_exc())
                self.message_user(request, f"❌ Error fetching {job}: {e}")

    fetch_job_post.short_description = "Fetch and save job post HTML"


@admin.register(Attachment)
class AttachmentAdmin(admin.ModelAdmin):
    list_display = (
        "job",
        "type",
        "filename",
        "mime_type",
        "size_bytes",
        "uploaded_at",
    )
    list_filter = ("type",)
    search_fields = ("filename", "job__position_title", "job__company__name")
    ordering = ("-uploaded_at",)
