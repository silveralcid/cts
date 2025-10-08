import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCompanyById, getCompanyJobs } from "../api/companies";
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
} from "@mantine/core";
import { Briefcase } from "phosphor-react";

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();

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
    <Container size="md">
      <Group justify="space-between" mb="md">
        <Title order={2}>{company.name}</Title>
        {company.website && (
          <Anchor
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Website
          </Anchor>
        )}
      </Group>

      <Divider label="Jobs at this company" labelPosition="center" mb="md" />

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
