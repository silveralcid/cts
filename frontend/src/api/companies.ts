import { api } from "./client";
import type { Company } from "../types/company";
import type { Job } from "../types/job";

export async function getCompanies(): Promise<Company[]> {
  const res = await api.get<Company[]>("/companies/");
  return res.data;
}

export async function getCompanyById(id: string): Promise<Company> {
  const res = await api.get<Company>(`/companies/${id}/`);
  return res.data;
}

// Assuming your DRF Company serializer nests jobs or you have an endpoint for this:
export async function getCompanyJobs(id: string): Promise<Job[]> {
  const res = await api.get<Job[]>(`/companies/${id}/jobs/`);
  return res.data;
}

export async function deleteCompany(id: string): Promise<void> {
  await api.delete(`/companies/${id}/`);
}

export async function createCompany(
  newCompany: Partial<Company>
): Promise<Company> {
  const { data } = await api.post<Company>("/companies/", newCompany);
  return data;
}
