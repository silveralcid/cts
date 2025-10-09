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
