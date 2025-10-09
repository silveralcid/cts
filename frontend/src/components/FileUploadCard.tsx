import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadAttachment } from "../api/attachments";
import {
  Card,
  Button,
  FileInput,
  Select,
  Stack,
  Text,
  Group,
  Loader,
} from "@mantine/core";
import { Paperclip } from "phosphor-react";

interface FileUploadCardProps {
  jobId: string;
}

export function FileUploadCard({ jobId }: FileUploadCardProps) {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<"resume" | "job_details" | "other_document">(
    "other_document"
  );

  const mutation = useMutation({
    mutationFn: () => {
      if (!file) throw new Error("No file selected");
      return uploadAttachment(jobId, file, type);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      setFile(null);
    },
  });

  return (
    <Card withBorder shadow="xs" mt="xl">
      <Stack>
        <Group>
          <Paperclip size={18} />
          <Text fw={500}>Upload Attachment</Text>
        </Group>

        <Select
          label="Attachment Type"
          data={[
            { value: "resume", label: "Resume" },
            { value: "job_details", label: "Job Details" },
            { value: "other_document", label: "Other Document" },
          ]}
          value={type}
          onChange={(v) =>
            setType(
              (v as "resume" | "job_details" | "other_document") ??
                "other_document"
            )
          }
        />

        <FileInput
          label="Select file"
          placeholder="Choose a PDF, TXT, or Markdown file"
          value={file}
          onChange={setFile}
          accept=".pdf,.txt,.md"
        />

        <Button
          onClick={() => mutation.mutate()}
          disabled={!file || mutation.isPending}
        >
          {mutation.isPending ? <Loader size="xs" /> : "Upload"}
        </Button>

        {mutation.isError && (
          <Text c="red" size="sm">
            {(mutation.error as Error).message}
          </Text>
        )}
      </Stack>
    </Card>
  );
}
