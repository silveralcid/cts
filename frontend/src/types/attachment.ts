/**
 * Represents a file uploaded and linked to a specific job.
 * Mirrors the Django Attachment model.
 */
export interface Attachment {
  id: string;
  job: string; // or Job if you prefer full relation expansion
  type: "resume" | "job_details" | "other_document";
  file: string; // URL of the uploaded file
  filename: string;
  mime_type?: string | null;
  size_bytes?: number | null;
  uploaded_at: string;
}
