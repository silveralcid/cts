from django.core.management.base import BaseCommand
from django.utils import timezone
from faker import Faker
import random

from jobs.models import Company, Job


class Command(BaseCommand):
    help = "Seed database with sample data for prototyping"

    def add_arguments(self, parser):
        parser.add_argument(
            "--companies", type=int, default=5, help="Number of companies to create")
        parser.add_argument(
            "--jobs", type=int, default=20, help="Number of jobs to create")

    def handle(self, *args, **options):
        fake = Faker()
        companies = []
        self.stdout.write(self.style.NOTICE("Seeding companies..."))

        for _ in range(options["companies"]):
            company = Company.objects.create(
                name=fake.company(),
                website=fake.url(),
            )
            companies.append(company)

        self.stdout.write(self.style.SUCCESS(
            f"✅ Created {len(companies)} companies."))

        statuses = [choice[0] for choice in Job.STATUS_CHOICES]
        self.stdout.write(self.style.NOTICE("Seeding jobs..."))

        for _ in range(options["jobs"]):
            company = random.choice(companies)
            status = random.choice(statuses)
            Job.objects.create(
                company=company,
                position_title=fake.job(),
                status=status,
                priority=random.randint(1, 5),
                job_post_url=fake.url(),
                job_notes=fake.paragraph(nb_sentences=3),
                about=fake.text(),
                requirements=fake.text(),
                responsibilities=fake.text(),
                benefits=fake.text(),
                pay_scale=f"${random.randint(50,150)}k/year",
                location=fake.city(),
                department=fake.word(),
                employment_type=random.choice(
                    ["Full-time", "Part-time", "Contract"]),
                date_posted=fake.date_between(
                    start_date="-30d", end_date="today"),
                date_applied=fake.date_between(
                    start_date="-15d", end_date="today"),
                created_at=timezone.now(),
            )

        self.stdout.write(self.style.SUCCESS(
            f"✅ Created {options['jobs']} jobs."))
        self.stdout.write(self.style.SUCCESS("🎉 Seeding complete!"))
