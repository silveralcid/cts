
# 🧭 Career Tracking System (CTS)

## 📄 Project Summary
Career Tracking System (CTS) is an **open-source web app** that helps job seekers organize their entire job search pipeline. It centralizes job listings, resumes, application statuses, key dates, and notes—all within a **fast, minimalist interface**.  
The goal is to make personal career management more structured, searchable, and exportable.

---

## 🚨 Problem
Job seekers often juggle multiple applications across spreadsheets, emails, and job boards, leading to:
- Disorganization and missed follow-ups  
- Redundant effort across platforms  
- Limited control over personal data  

Existing tools like *Teal* and *Huntr* are powerful but **closed, bloated, or slow to customize**.  
CTS fills the gap with a **lightweight, developer-friendly, open-source tracker** built for simplicity and extensibility.

---

## 💡 Solution
CTS provides a **self-hosted, privacy-first** platform for managing all job search artifacts in one place.  

### Core Features
- Quick job entry from URLs or PDF parsing  
- Resume and document uploads  
- Status tracking with custom fields  
- Filtering, sorting, and CSV export  
- Extensible backend for AI analysis, contact management, or automation  

---

## ⚙️ Tech Stack

### Frontend
- **React + TypeScript** (Vite or Next.js)  
- React Query, Tailwind CSS  
- Zod + React Hook Form  
- PDF.js for job post parsing  

### Backend
- **Django 5 + Django REST Framework**  
- PostgreSQL, Redis, Celery  
- `django-storages` (S3 support)

### Infrastructure
- Docker Compose  
- Nginx  
- GitHub Actions (CI/CD)  
- Sentry (monitoring)

### Testing
- `pytest` (backend)  
- `Vitest` and `Playwright` (frontend)

---

## 🚀 Future Ideas
- AI-based resume–job fit scoring  
- Browser extension for one-click job imports  
- Email parsing for recruiter threads
