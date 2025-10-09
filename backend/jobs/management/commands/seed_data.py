from django.core.management.base import BaseCommand
from django.utils import timezone
from faker import Faker
import random

from jobs.models import Company, Job


class Command(BaseCommand):
    help = "Seed database with sample Company and Job data for prototyping"

    def add_arguments(self, parser):
        parser.add_argument("--companies", type=int, default=5,
                            help="Number of companies to create")
        parser.add_argument("--jobs", type=int, default=20,
                            help="Number of jobs to create")
        parser.add_argument("--flush", action="store_true",
                            help="Delete existing data before seeding")

    def handle(self, *args, **options):
        fake = Faker()

        if options["flush"]:
            self.stdout.write(self.style.WARNING("Clearing existing data..."))
            Job.objects.all().delete()
            Company.objects.all().delete()

        # -----------------------------
        # Seed Companies
        # -----------------------------
        self.stdout.write(self.style.NOTICE("Seeding companies..."))

        size_choices = [s[0] for s in Company.SIZE_CHOICES]
        companies = []

        for _ in range(options["companies"]):
            company = Company.objects.create(
                name=fake.company(),
                website=fake.url() if random.random() > 0.2 else None,
                notes=fake.paragraph(
                    nb_sentences=2) if random.random() > 0.5 else None,
                is_nonprofit=random.choice([True, False]),
                industry=random.choice(
                    [None, "Technology", "Finance", "Healthcare",
                        "Education", "Retail", "Manufacturing"]
                ),
                keywords=random.choice(
                    [None, ["AI", "SaaS", "Analytics"], [
                        "Blockchain", "Fintech"], ["Recruiting", "B2B"]]
                ),
                stage=random.choice(
                    [None, "Seed", "Series A", "Series B", "Public"]),
                funding=random.choice(
                    [None, "$2M", "$15M", "$100M", "Undisclosed"]),
                founding_year=random.choice([None, 2005, 2010, 2015, 2020]),
                size=random.choice(size_choices + [None]),
            )
            companies.append(company)

        self.stdout.write(self.style.SUCCESS(
            f"✅ Created {len(companies)} companies."))

        # -----------------------------
        # Seed Jobs
        # -----------------------------
        self.stdout.write(self.style.NOTICE("Seeding jobs..."))

        statuses = [choice[0] for choice in Job.Status.choices]
        role_types = [choice[0] for choice in Job.RoleType.choices]
        currencies = [choice[0] for choice in Job.Currency.choices]

        for _ in range(options["jobs"]):
            company = random.choice(companies)
            status = random.choice(statuses)

            salary_min = random.choice([None, random.randint(50_000, 120_000)])
            salary_max = salary_min + \
                random.randint(5_000, 40_000) if salary_min else None
            salary_currency = random.choice(currencies + [None])

            education_data = {
                "associate": {"requirement": random.choice(["NOT_MENTIONED", "PREFERRED"]), "majors": []},
                "bachelor": {"requirement": random.choice(["REQUIRED", "PREFERRED"]), "majors": ["Computer Science"]},
                "master": {"requirement": random.choice(["PREFERRED", "NOT_MENTIONED"]), "majors": []},
                "doctorate": {"requirement": "NOT_MENTIONED", "majors": []},
            }

            shifts_data = {
                "shifts": {
                    "morning_first": random.choice(Job.SHIFT_REQUIREMENT_CHOICES),
                    "afternoon_second": random.choice(Job.SHIFT_REQUIREMENT_CHOICES),
                    "overnight_third": random.choice(Job.SHIFT_REQUIREMENT_CHOICES),
                },
                "availability": {
                    "weekend": random.choice(Job.AVAILABILITY_CHOICES),
                    "holiday": random.choice(Job.AVAILABILITY_CHOICES),
                    "overtime": random.choice(Job.AVAILABILITY_CHOICES),
                },
                "oncall": random.sample(["NONE", "OCCASIONAL", "REGULAR"], k=random.randint(1, 3)),
            }

            job = Job.objects.create(
                company=company,
                position_title=fake.job(),
                status=status,
                priority=random.randint(1, 5),
                job_post_url=fake.url() if random.random() > 0.3 else None,
                job_notes=fake.paragraph(
                    nb_sentences=3) if random.random() > 0.4 else None,
                about=fake.text() if random.random() > 0.3 else None,
                requirements=fake.paragraph(
                    nb_sentences=4) if random.random() > 0.4 else None,
                responsibilities=fake.paragraph(
                    nb_sentences=3) if random.random() > 0.4 else None,
                benefits=fake.paragraph(
                    nb_sentences=2) if random.random() > 0.4 else None,
                salary_min=salary_min,
                salary_max=salary_max,
                salary_currency=salary_currency,
                salary_raw=(
                    f"${salary_min}-{salary_max} {salary_currency}" if salary_min and salary_currency else None
                ),
                location=fake.city() if random.random() > 0.3 else None,
                is_remote=random.choice([True, False]),
                department=random.choice([None, fake.word().capitalize()]),
                employment_type=random.choice(
                    [None, "Full-time", "Part-time", "Contract", "Internship"]
                ),
                role_type=random.choice(role_types + [None]),
                education=education_data if random.random() > 0.3 else {},
                licenses_certifications=random.sample(
                    ["AWS Certified", "PMP", "Scrum Master"], k=random.randint(0, 2)
                ),
                security_clearances=random.sample(
                    ["None", "Confidential", "Secret", "Top Secret"], k=random.randint(0, 2)
                ),
                languages=random.sample(
                    ["English", "Spanish", "French", "German", "Japanese"], k=random.randint(0, 3)
                ),
                shifts_and_schedules=shifts_data if random.random() > 0.3 else {},
                travel_requirements=random.choice(
                    [None, "None",
                        "Occasional (10%)", "Frequent (25%)", "Extensive (50%+)"]
                ),
                benefits_perks=random.sample(
                    ["Health Insurance", "401k", "Remote Work",
                        "Gym Stipend", "Stock Options"],
                    k=random.randint(0, 4),
                ),
                date_posted=fake.date_between(
                    start_date="-30d", end_date="today") if random.random() > 0.2 else None,
                date_applied=fake.date_between(
                    start_date="-15d", end_date="today") if random.random() > 0.3 else None,
                created_at=timezone.now(),
            )

        self.stdout.write(self.style.SUCCESS(
            f"✅ Created {options['jobs']} jobs."))
        self.stdout.write(self.style.SUCCESS("🎉 Seeding complete!"))
