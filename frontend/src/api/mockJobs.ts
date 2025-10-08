import { v4 as uuidv4 } from "uuid";

export type Company = {
  id: string;
  name: string;
  website?: string | null;
};

export type Job = {
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
  date_deadline?: string | null;
  date_applied?: string | null;
  date_posted?: string | null;
  pay_scale?: string | null;
  location?: string | null;
  department?: string | null;
  employment_type?: string | null;
  created_at: string;
  updated_at: string;
};

// Mock companies
export const mockCompanies: Company[] = [
  {
    id: uuidv4(),
    name: "Teal Corp",
    website: "https://www.teal.io",
  },
  {
    id: uuidv4(),
    name: "Huntr Labs",
    website: "https://www.huntr.co",
  },
  {
    id: uuidv4(),
    name: "CareerFlow",
    website: "https://www.careerflow.ai",
  },
];

// Mock jobs
export const mockJobs: Job[] = [
  {
    id: uuidv4(),
    company: mockCompanies[0],
    position_title: "Frontend Developer",
    status: "APPLIED",
    priority: 4,
    job_post_url: "https://teal.io/jobs/frontend-dev",
    location: "Remote",
    pay_scale: "$90k–110k",
    created_at: "2025-09-25T10:00:00Z",
    updated_at: "2025-09-30T12:00:00Z",
  },
  {
    id: uuidv4(),
    company: mockCompanies[1],
    position_title: "Backend Engineer",
    status: "INTERVIEWING",
    priority: 5,
    job_post_url: "https://huntr.co/careers/backend-engineer",
    location: "New York, NY",
    pay_scale: "$100k–120k",
    created_at: "2025-09-20T10:00:00Z",
    updated_at: "2025-10-01T08:00:00Z",
  },
  {
    id: uuidv4(),
    company: mockCompanies[2],
    position_title: "Product Designer",
    status: "BOOKMARKED",
    priority: 3,
    job_post_url: "https://careerflow.ai/jobs/product-designer",
    location: "Remote",
    pay_scale: "$80k–100k",
    created_at: "2025-09-18T09:00:00Z",
    updated_at: "2025-09-18T09:00:00Z",
  },
];
