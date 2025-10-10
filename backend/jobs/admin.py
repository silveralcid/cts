from django.contrib import admin
from django.utils.html import format_html
from jobs.models import Company, Job, Attachment
from jobs.fetchers import fetch_job_post_html  # 👈 make sure this file exists


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("name", "industry", "size",
                    "is_nonprofit", "founding_year")
    search_fields = ("name", "industry")
    list_filter = ("is_nonprofit", "size", "stage")
    ordering = ("name",)


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ("position_title", "company", "status",
                    "priority", "is_remote", "date_posted")
    search_fields = ("position_title", "company__name")
    list_filter = ("status", "is_remote", "employment_type", "role_type")
    ordering = ("-priority",)

    # 👇 new fields for local testing
    readonly_fields = ("html_preview",)
    actions = ["fetch_job_post"]

    def fetch_job_post(self, request, queryset):
        """Admin action to fetch and preview job post HTML."""
        for job in queryset:
            if not job.job_post_url:
                self.message_user(request, f"{job} has no job_post_url set.")
                continue

            try:
                html = fetch_job_post_html(job.job_post_url)
                preview = html[:300].replace("\n", " ")  # short snippet
                self.message_user(
                    request, f"Fetched {len(html)} bytes from {job.job_post_url}: {preview}…")
            except Exception as e:
                self.message_user(request, f"Error fetching {job}: {e}")
        return None

    fetch_job_post.short_description = "Fetch job post HTML preview"

    def html_preview(self, obj):
        """Display a scrollable snippet of fetched HTML."""
        if not obj.job_post_url:
            return "(no job_post_url set)"
        try:
            html = fetch_job_post_html(obj.job_post_url)
            # Trim to keep admin responsive
            snippet = html
            # Escape < and > so they don't render as actual HTML
            escaped = snippet.replace("<", "&lt;").replace(">", "&gt;")
            return format_html(
                "<div style='white-space: pre-wrap; max-height: 400px; overflow:auto; "
                "background:#1e1e1e; color:#d4d4d4; border:1px solid #555; padding:10px; "
                "font-family: monospace;'>{}</div>",
                escaped
            )
        except Exception as e:
            return format_html("<div style='color:red;'>Error: {}</div>", e)

    html_preview.short_description = "HTML Preview"


@admin.register(Attachment)
class AttachmentAdmin(admin.ModelAdmin):
    list_display = ("job", "type", "filename", "mime_type",
                    "size_bytes", "uploaded_at")
    list_filter = ("type",)
    search_fields = ("filename", "job__position_title", "job__company__name")
    ordering = ("-uploaded_at",)
