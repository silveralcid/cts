from django.contrib import admin
from jobs.models import Company, Job, Attachment


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


@admin.register(Attachment)
class AttachmentAdmin(admin.ModelAdmin):
    list_display = ("job", "type", "filename", "mime_type",
                    "size_bytes", "uploaded_at")
    list_filter = ("type",)
    search_fields = ("filename", "job__position_title", "job__company__name")
    ordering = ("-uploaded_at",)
