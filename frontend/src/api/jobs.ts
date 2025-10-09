import { api } from "./client";
import type { Job } from "../types/job";

export async function getJobs(): Promise<Job[]> {
  const res = await api.get<Job[]>("/jobs/");
  return res.data;
}

export async function getJobById(id: string): Promise<Job> {
  const res = await api.get<Job>(`/jobs/${id}/`);
  return res.data;
}

export async function deleteJob(id: string): Promise<void> {
  await api.delete(`/jobs/${id}/`);
}
