import { api } from "./client";
import type { Job } from "./mockJobs";

export async function getJobs(): Promise<Job[]> {
  const res = await api.get<Job[]>("/jobs/");
  return res.data;
}

export async function getJobById(id: string): Promise<Job> {
  const res = await api.get<Job>(`/jobs/${id}/`);
  return res.data;
}
