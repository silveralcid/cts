import type { Company } from "./company";

/**
 * Represents a job listing or application record.
 * Mirrors the Django Job model fields that are relevant to the frontend.
 */
export interface Job {
  id: string;
  company: Company;
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

  // Optional dates
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
  pay_scale?: string | null;
  location?: string | null;
  department?: string | null;
  employment_type?: string | null;

  created_at: string;
  updated_at: string;
  archived_at?: string | null;
}
