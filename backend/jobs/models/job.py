from django.db import models
import uuid


class Job(models.Model):
    # ===========================
    # Choice Enums
    # ===========================

    class Status(models.TextChoices):
        BOOKMARKED = "BOOKMARKED", "Bookmarked"
        APPLYING = "APPLYING", "Applying"
        APPLIED = "APPLIED", "Applied"
        INTERVIEWING = "INTERVIEWING", "Interviewing"
        NEGOTIATING = "NEGOTIATING", "Negotiating"
        ACCEPTED = "ACCEPTED", "Accepted"
        WITHDREW = "WITHDREW", "Withdrew"
        NOT_ACCEPTED = "NOT_ACCEPTED", "Not Accepted"
        NO_RESPONSE = "NO_RESPONSE", "No Response"
        ARCHIVED = "ARCHIVED", "Archived"

    class RoleType(models.TextChoices):
        IC = "IC", "Individual Contributor"
        MANAGER = "MANAGER", "People Manager"
        EXECUTIVE = "EXECUTIVE", "Executive / Leadership"

    class Currency(models.TextChoices):
        USD = "USD", "USD"
        EUR = "EUR", "EUR"
        GBP = "GBP", "GBP"
        CAD = "CAD", "CAD"
        AUD = "AUD", "AUD"
        JPY = "JPY", "JPY"
        OTHER = "OTHER", "Other"

    # ===========================
    # Core Fields
    # ===========================

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(
        "Company", on_delete=models.CASCADE, related_name="jobs")

    position_title = models.CharField(max_length=255)
    status = models.CharField(
        max_length=32,
        choices=Status.choices,
        default=Status.BOOKMARKED,
    )
    priority = models.IntegerField(default=3)
    job_post_url = models.URLField(blank=True, null=True)
    job_notes = models.TextField(blank=True, null=True)

    # ===========================
    # Dates
    # ===========================

    date_deadline = models.DateField(blank=True, null=True)
    date_applied = models.DateField(blank=True, null=True)
    date_interviewed = models.DateField(blank=True, null=True)
    date_offered = models.DateField(blank=True, null=True)
    date_posted = models.DateField(blank=True, null=True)
    date_accepted = models.DateField(blank=True, null=True)
    date_rejected = models.DateField(blank=True, null=True)

    # ===========================
    # Description
    # ===========================

    about = models.TextField(blank=True, null=True)
    requirements = models.TextField(blank=True, null=True)
    responsibilities = models.TextField(blank=True, null=True)
    benefits = models.TextField(blank=True, null=True)

    # ===========================
    # Compensation & Employment
    # ===========================

    salary_min = models.DecimalField(
        max_digits=12, decimal_places=2, blank=True, null=True)
    salary_max = models.DecimalField(
        max_digits=12, decimal_places=2, blank=True, null=True)
    salary_currency = models.CharField(
        max_length=8,
        choices=Currency.choices,
        blank=True,
        null=True,
    )
    salary_raw = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Unparsed salary text from job post",
    )

    location = models.CharField(max_length=255, blank=True, null=True)
    is_remote = models.BooleanField(default=False)
    department = models.CharField(max_length=255, blank=True, null=True)
    employment_type = models.CharField(max_length=255, blank=True, null=True)
    role_type = models.CharField(
        max_length=32,
        choices=RoleType.choices,
        blank=True,
        null=True,
    )

    # ===========================
    # Education & Credentials
    # ===========================

    education = models.JSONField(
        default=dict,
        blank=True,
        help_text="Degree requirements and majors by level",
    )
    licenses_certifications = models.JSONField(default=list, blank=True)
    security_clearances = models.JSONField(
        default=list,
        blank=True,
        help_text="List of applicable security clearance levels.",
    )

    # ===========================
    # Skills, Shifts, and Conditions
    # ===========================

    SHIFT_REQUIREMENT_CHOICES = ["REQUIRED", "OPTIONAL", "NOT_INDICATED"]
    AVAILABILITY_CHOICES = ["REQUIRED", "NOT_INDICATED", "DOESNT_MATTER"]

    languages = models.JSONField(default=list, blank=True)
    shifts_and_schedules = models.JSONField(
        default=dict,
        blank=True,
        help_text="Shift, schedule, and availability details for the job.",
    )
    travel_requirements = models.CharField(
        max_length=255, blank=True, null=True)
    benefits_perks = models.JSONField(
        default=list,
        blank=True,
        help_text="List of benefits/perks offered.",
    )

    # ===========================
    # System Metadata
    # ===========================

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    archived_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ["-priority"]

    def __str__(self):
        return f"{self.position_title} at {self.company.name}"
