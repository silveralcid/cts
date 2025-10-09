import { useParams, Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteCompany,
  getCompanyById,
  getCompanyJobs,
} from "../api/companies";
import {
  Container,
  Title,
  Text,
  Loader,
  Center,
  Group,
  Anchor,
  Table,
  Divider,
  Badge,
  Stack,
  Card,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { Briefcase, Globe, Trash } from "phosphor-react";

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ✅ Fetch company and jobs first
  const {
    data: company,
    isLoading: loadingCompany,
    isError: errorCompany,
  } = useQuery({
    queryKey: ["company", id],
    queryFn: () => getCompanyById(id!),
    enabled: !!id,
  });

  const {
    data: jobs = [],
    isLoading: loadingJobs,
    isError: errorJobs,
  } = useQuery({
    queryKey: ["company-jobs", id],
    queryFn: () => getCompanyJobs(id!),
    enabled: !!id,
  });

  // ✅ Now define delete mutation safely after company is available
  const deleteCompanyMutation = useMutation({
    mutationFn: () => deleteCompany(company!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      navigate("/companies");
    },
  });

  if (loadingCompany || loadingJobs)
    return (
      <Center mt="xl">
        <Loader />
      </Center>
    );

  if (errorCompany || errorJobs || !company)
    return (
      <Center mt="xl">
        <Text c="red">Failed to load company details.</Text>
      </Center>
    );

  return (
    <Container size="md" py="xl">
      {/* Header */}
      <Group justify="space-between" mb="md" align="flex-start">
        <Stack gap={4}>
          <Group justify="space-between" align="center">
            <Title order={2}>{company.name}</Title>
            <Tooltip label="Delete this company">
              <ActionIcon
                color="red"
                variant="light"
                onClick={() => {
                  if (confirm("Delete this company and all related jobs?")) {
                    deleteCompanyMutation.mutate();
                  }
                }}
                loading={deleteCompanyMutation.isPending}
              >
                <Trash size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>

          <Group gap="xs">
            {company.is_nonprofit && <Badge color="green">Non-Profit</Badge>}
            {company.industry && (
              <Badge color="blue" variant="light">
                {company.industry}
              </Badge>
            )}
            {company.stage && (
              <Badge color="gray" variant="light">
                {company.stage}
              </Badge>
            )}
            {company.size && (
              <Badge color="orange" variant="light">
                {company.size} employees
              </Badge>
            )}
          </Group>
        </Stack>

        {company.website && (
          <Anchor
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Group gap={4}>
              <Globe size={16} />
              <Text size="sm">Visit Website</Text>
            </Group>
          </Anchor>
        )}
      </Group>

      {/* Overview Card */}
      <Card withBorder shadow="xs" mb="xl">
        <Stack gap="xs">
          {company.founding_year && (
            <Text>
              <b>Founded:</b> {company.founding_year}
            </Text>
          )}
          {company.funding && (
            <Text>
              <b>Funding:</b> {company.funding}
            </Text>
          )}
          {company.keywords && company.keywords.length > 0 && (
            <Text>
              <b>Keywords:</b>{" "}
              {company.keywords.map((k: string) => (
                <Badge key={k} color="teal" variant="light" mx={2}>
                  {k}
                </Badge>
              ))}
            </Text>
          )}
          {company.notes && (
            <Text c="dimmed" mt="sm">
              {company.notes}
            </Text>
          )}
        </Stack>
      </Card>

      <Divider label="Jobs at this company" labelPosition="center" mb="md" />

      {/* Job list */}
      {jobs.length === 0 ? (
        <Text c="dimmed">No jobs found for this company.</Text>
      ) : (
        <Table highlightOnHover withTableBorder striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Position</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Priority</Table.Th>
              <Table.Th>Location</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {jobs.map((job) => (
              <Table.Tr key={job.id}>
                <Table.Td>
                  <Group gap="xs">
                    <Briefcase size={14} />
                    <Anchor component={Link} to={`/jobs/${job.id}`}>
                      {job.position_title}
                    </Anchor>
                  </Group>
                </Table.Td>
                <Table.Td>{job.status}</Table.Td>
                <Table.Td>{job.priority}</Table.Td>
                <Table.Td>{job.location || "—"}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Container>
  );
}
