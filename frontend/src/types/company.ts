/**
 * Represents an employer company.
 */
export interface Company {
  id: string;
  name: string;
  website?: string | null;

  // Additional fields from Django model
  notes?: string | null;
  is_nonprofit: boolean;
  industry?: string | null;
  keywords?: string[] | null; // JSONField representing list of tags
  stage?: string | null;
  funding?: string | null;
  founding_year?: number | null;

  // One of the size ranges defined in Django SIZE_CHOICES
  size?:
    | "1-10"
    | "11-50"
    | "51-200"
    | "201-500"
    | "501-1000"
    | "1001-2000"
    | "2001-5000"
    | "5001-10000"
    | "10001+"
    | null;
}
