import type { Company } from "./company";

/**
 * Represents a job listing or application record.
 * Mirrors the Django Job model fields that are relevant to the frontend.
 */
export interface Job {
  id: string;
  company: Company;

  // Core details
  position_title: string;
  status:
    | "BOOKMARKED"
    | "APPLYING"
    | "APPLIED"
    | "INTERVIEWING"
    | "NEGOTIATING"
    | "ACCEPTED"
    | "WITHDREW"
    | "NOT_ACCEPTED"
    | "NO_RESPONSE"
    | "ARCHIVED";
  priority: number;
  job_post_url?: string | null;
  job_notes?: string | null;

  // Dates
  date_deadline?: string | null;
  date_applied?: string | null;
  date_interviewed?: string | null;
  date_offered?: string | null;
  date_posted?: string | null;
  date_accepted?: string | null;
  date_rejected?: string | null;

  // Descriptive fields
  about?: string | null;
  requirements?: string | null;
  responsibilities?: string | null;
  benefits?: string | null;

  // Compensation & Employment
  salary_min?: number | null;
  salary_max?: number | null;
  salary_currency?:
    | "USD"
    | "EUR"
    | "GBP"
    | "CAD"
    | "AUD"
    | "JPY"
    | "OTHER"
    | null;
  salary_raw?: string | null;
  location?: string | null;
  is_remote: boolean;
  department?: string | null;
  employment_type?: string | null;
  role_type?: "IC" | "MANAGER" | "EXECUTIVE" | null;

  // Education & Credentials
  education?: Record<string, any> | null;
  licenses_certifications?: string[] | null;
  security_clearances?: string[] | null;

  // Skills, Shifts, and Conditions
  languages?: string[] | null;
  shifts_and_schedules?: Record<string, any> | null;
  travel_requirements?: string | null;
  benefits_perks?: string[] | null;

  // Metadata
  created_at: string;
  updated_at: string;
  archived_at?: string | null;
}
