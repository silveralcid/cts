import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getJobById } from "../api/jobs";
import { FileUploadCard } from "../components/FileUploadCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Container,
  Title,
  Text,
  Group,
  Badge,
  Anchor,
  Stack,
  Divider,
  Loader,
  Center,
  SimpleGrid,
  Card,
  List,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  Briefcase,
  Link as LinkIcon,
  MapPin,
  ArrowSquareOut,
  Paperclip,
  Trash,
} from "phosphor-react";
import { deleteAttachment } from "../api/attachments";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: job,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["job", id],
    queryFn: () => getJobById(id!),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <Center mt="xl">
        <Loader />
      </Center>
    );

  if (isError || !job)
    return (
      <Center mt="xl">
        <Text c="red">Failed to load job details.</Text>
      </Center>
    );

  const renderDate = (label: string, date?: string | null) => (
    <Group justify="space-between">
      <Text fw={500}>{label}</Text>
      <Text c="dimmed">{date ? new Date(date).toLocaleDateString() : "—"}</Text>
    </Group>
  );

  const renderSalary = () => {
    if (job.salary_min || job.salary_max || job.salary_currency) {
      const min = job.salary_min ? job.salary_min.toLocaleString() : "—";
      const max = job.salary_max ? job.salary_max.toLocaleString() : "—";
      const cur = job.salary_currency || "";
      return `${cur} ${min} - ${max}`;
    }
    return "—";
  };

  // Inside JobDetailPage.tsx or separate file AttachmentItem.tsx
  function AttachmentItem({
    attachment,
    jobId,
  }: {
    attachment: any;
    jobId: string;
  }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: () => deleteAttachment(attachment.id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      },
    });

    return (
      <List.Item
        key={attachment.id}
        icon={<Paperclip size={14} />}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Group gap="xs" justify="space-between" w="100%">
          <Anchor
            href={attachment.file}
            target="_blank"
            rel="noopener noreferrer"
          >
            {attachment.filename || "Download file"} ({attachment.type})
          </Anchor>

          <Tooltip label="Delete attachment">
            <ActionIcon
              color="red"
              variant="light"
              size="sm"
              onClick={() => mutation.mutate()}
              loading={mutation.isPending}
            >
              <Trash size={14} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </List.Item>
    );
  }

  return (
    <Container size="md" py="xl">
      {/* Header */}
      <Stack gap="xs" mb="xl">
        <Group justify="space-between">
          <Title order={2}>{job.position_title}</Title>
          <Badge color="blue" size="lg">
            {job.status}
          </Badge>
        </Group>

        {/* Company link section */}
        <Group gap="xs" c="dimmed">
          <Briefcase size={16} />
          <Anchor
            component={Link}
            to={`/companies/${job.company.id}`}
            underline="hover"
          >
            {job.company.name}
          </Anchor>

          {job.location && (
            <>
              <MapPin size={16} />
              <Text>{job.location}</Text>
            </>
          )}
        </Group>

        {/* External job post link */}
        {job.job_post_url && (
          <Anchor
            href={job.job_post_url}
            target="_blank"
            rel="noopener noreferrer"
            mt="xs"
          >
            <Group gap="xs">
              <LinkIcon size={14} />
              <Text size="sm">View Original Posting</Text>
              <ArrowSquareOut size={12} weight="fill" />
            </Group>
          </Anchor>
        )}
      </Stack>

      <Divider label="Overview" labelPosition="center" mb="md" />

      {/* Key fields */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm" mb="lg">
        <Text>
          <b>Priority:</b> {job.priority}
        </Text>
        <Text>
          <b>Department:</b> {job.department || "—"}
        </Text>
        <Text>
          <b>Employment Type:</b> {job.employment_type || "—"}
        </Text>
        <Text>
          <b>Role Type:</b> {job.role_type || "—"}
        </Text>
        <Text>
          <b>Remote:</b> {job.is_remote ? "Yes" : "No"}
        </Text>
        <Text>
          <b>Salary Range:</b> {renderSalary()}
        </Text>
      </SimpleGrid>

      {/* Dates */}
      <Card withBorder shadow="xs" mb="xl">
        <Title order={4} mb="sm">
          Important Dates
        </Title>
        <Stack gap="xs">
          {renderDate("Deadline", job.date_deadline)}
          {renderDate("Date Applied", job.date_applied)}
          {renderDate("Interviewed", job.date_interviewed)}
          {renderDate("Offered", job.date_offered)}
          {renderDate("Accepted", job.date_accepted)}
          {renderDate("Rejected", job.date_rejected)}
          {renderDate("Posted", job.date_posted)}
        </Stack>
      </Card>

      {/* Descriptions */}
      <Stack gap="xl">
        {job.about && (
          <section>
            <Title order={4}>About</Title>
            <Text c="dimmed" mt="xs">
              {job.about}
            </Text>
          </section>
        )}

        {job.requirements && (
          <section>
            <Title order={4}>Requirements</Title>
            <Text c="dimmed" mt="xs" style={{ whiteSpace: "pre-line" }}>
              {job.requirements}
            </Text>
          </section>
        )}

        {job.responsibilities && (
          <section>
            <Title order={4}>Responsibilities</Title>
            <Text c="dimmed" mt="xs" style={{ whiteSpace: "pre-line" }}>
              {job.responsibilities}
            </Text>
          </section>
        )}

        {job.benefits && (
          <section>
            <Title order={4}>Benefits</Title>
            <Text c="dimmed" mt="xs">
              {job.benefits}
            </Text>
          </section>
        )}

        {job.job_notes && (
          <section>
            <Title order={4}>Notes</Title>
            <Text mt="xs">{job.job_notes}</Text>
          </section>
        )}

        {/* Attachments */}
        <FileUploadCard jobId={job.id} />
        {job.attachments && job.attachments.length > 0 && (
          <section>
            <Divider label="Attachments" labelPosition="center" my="md" />
            <List spacing="xs" icon={<Paperclip size={14} />}>
              {job.attachments.map((a) => (
                <AttachmentItem key={a.id} attachment={a} jobId={job.id} />
              ))}
            </List>
          </section>
        )}
      </Stack>
    </Container>
  );
}
