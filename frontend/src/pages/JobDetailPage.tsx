import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getJobById } from "../api/jobs";
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
} from "@mantine/core";
import {
  Briefcase,
  Link as LinkIcon,
  MapPin,
  ArrowSquareOut,
} from "phosphor-react";

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
          <b>Pay Scale:</b> {job.pay_scale || "—"}
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
          <div>
            <Title order={4}>About</Title>
            <Text c="dimmed" mt="xs">
              {job.about}
            </Text>
          </div>
        )}

        {job.requirements && (
          <div>
            <Title order={4}>Requirements</Title>
            <Text c="dimmed" mt="xs" style={{ whiteSpace: "pre-line" }}>
              {job.requirements}
            </Text>
          </div>
        )}

        {job.responsibilities && (
          <div>
            <Title order={4}>Responsibilities</Title>
            <Text c="dimmed" mt="xs" style={{ whiteSpace: "pre-line" }}>
              {job.responsibilities}
            </Text>
          </div>
        )}

        {job.benefits && (
          <div>
            <Title order={4}>Benefits</Title>
            <Text c="dimmed" mt="xs">
              {job.benefits}
            </Text>
          </div>
        )}

        {job.job_notes && (
          <div>
            <Title order={4}>Notes</Title>
            <Text mt="xs">{job.job_notes}</Text>
          </div>
        )}
      </Stack>
    </Container>
  );
}
