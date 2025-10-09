import { api } from "./client";
import type { Attachment } from "../types/attachment";

export async function uploadAttachment(
  jobId: string,
  file: File,
  type: "resume" | "job_details" | "other_document" = "other_document"
): Promise<Attachment> {
  const formData = new FormData();
  formData.append("job", jobId);
  formData.append("type", type);
  formData.append("file", file);

  const { data } = await api.post<Attachment>("/attachments/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getAttachments(): Promise<Attachment[]> {
  const { data } = await api.get<Attachment[]>("/attachments/");
  return data;
}

export async function deleteAttachment(id: string): Promise<void> {
  await api.delete(`/attachments/${id}/`);
}
