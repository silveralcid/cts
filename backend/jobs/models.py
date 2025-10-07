from django.db import models
import uuid

# Create your models here.


class Company(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    website = models.URLField(blank=True, null=True)

    class Meta:
        ordering = ['name']

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

    class Meta:
        ordering = ['-priority']

    def __str__(self):
        return f"{self.position_title} at {self.company.name}"
