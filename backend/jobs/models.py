from django.db import models
import uuid


class Company(models.Model):
    SIZE_CHOICES = [
        ("1-10", "1–10"),
        ("11-50", "11–50"),
        ("51-200", "51–200"),
        ("201-500", "201–500"),
        ("501-1000", "501–1,000"),
        ("1001-2000", "1,001–2,000"),
        ("2001-5000", "2,001–5,000"),
        ("5001-10000", "5,001–10,000"),
        ("10001+", "10,001+"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    website = models.URLField(blank=True, null=True)

    notes = models.TextField(blank=True, null=True)
    is_nonprofit = models.BooleanField(default=False)
    industry = models.CharField(max_length=128, blank=True, null=True)
    keywords = models.JSONField(
        blank=True, null=True, help_text="List of descriptive tags")
    stage = models.CharField(max_length=64, blank=True, null=True)
    funding = models.CharField(max_length=128, blank=True, null=True)
    founding_year = models.PositiveIntegerField(blank=True, null=True)
    size = models.CharField(
        max_length=32,
        blank=True,
        null=True,
        choices=SIZE_CHOICES,
        help_text="Company size range by employee count",
    )

    class Meta:
        ordering = ["name"]
        verbose_name = "company"
        verbose_name_plural = "companies"

    def __str__(self):
        return str(self.name)


class Job(models.Model):
    STATUS_CHOICES = [
        ("BOOKMARKED", "Bookmarked"),
        ("APPLYING", "Applying"),
        ("APPLIED", "Applied"),
        ("INTERVIEWING", "Interviewing"),
        ("NEGOTIATING", "Negotiating"),
        ("ACCEPTED", "Accepted"),
        ("WITHDREW", "Withdrew"),
        ("NOT_ACCEPTED", "Not Accepted"),
        ("NO_RESPONSE", "No Response"),
        ("ARCHIVED", "Archived"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name='jobs')
    position_title = models.CharField(max_length=255)
    status = models.CharField(
        max_length=32, choices=STATUS_CHOICES, default="BOOKMARKED")
    priority = models.IntegerField(default=3)
    job_post_url = models.URLField(blank=True, null=True)
    job_notes = models.TextField(blank=True, null=True)

    # Dates
    date_deadline = models.DateField(blank=True, null=True)
    date_applied = models.DateField(blank=True, null=True)
    date_interviewed = models.DateField(blank=True, null=True)
    date_offered = models.DateField(blank=True, null=True)
    date_posted = models.DateField(blank=True, null=True)
    date_accepted = models.DateField(blank=True, null=True)
    date_rejected = models.DateField(blank=True, null=True)

    # Description

    about = models.TextField(blank=True, null=True)
    requirements = models.TextField(blank=True, null=True)
    responsibilities = models.TextField(blank=True, null=True)
    benefits = models.TextField(blank=True, null=True)
    pay_scale = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    department = models.CharField(max_length=255, blank=True, null=True)
    employment_type = models.CharField(max_length=255, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    archived_at = models.DateTimeField(blank=True, null=True)

    # Implement these
    # is_remote = models.Bool
    # Department
    # salary_min
    # salary_max
    # salary_currency
    # salary_raw
    # role_type = indiviudal contrib, people manager
    # education_requirements = models.JSONField(default=dict, blank=True)
    # licenses & certifications = keywords
    # security_clearances = models.JSONField(
    #     default=list,
    #     blank=True,
    #     help_text="List of applicable security clearance levels."
    # )
    # languages= keyword
    # shifts & schedules
    # travel requirement
    # benefits & perks, multi-choice + custom

    class Meta:
        ordering = ['-priority']

    def __str__(self):
        return f"{self.position_title} at {self.company.name}"
