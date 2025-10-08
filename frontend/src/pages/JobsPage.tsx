import { useState } from "react";
import {
  Title,
  Container,
  TextInput,
  Select,
  Group,
  Button,
  Stack,
  Text,
  Loader,
  Center,
} from "@mantine/core";
import { MagnifyingGlass } from "phosphor-react";
import { useQuery } from "@tanstack/react-query";
import { getJobs } from "../api/jobs";
import JobTable from "../components/JobTable";

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // 🔥 Fetch data with React Query
  const {
    data: jobs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.position_title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading)
    return (
      <Center mt="xl">
        <Loader />
      </Center>
    );

  if (isError)
    return (
      <Center mt="xl">
        <Text c="red">Failed to load jobs.</Text>
      </Center>
    );

  return (
    <Container>
      <Title order={2} mb="sm">
        Jobs
      </Title>
      <Text size="sm" c="dimmed" mb="md">
        Browse and manage your job applications.
      </Text>

      <Stack gap="sm" mb="md">
        <Group grow>
          <TextInput
            placeholder="Search by title or company"
            leftSection={<MagnifyingGlass size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />

          <Select
            placeholder="Filter by status"
            clearable
            data={[
              { value: "BOOKMARKED", label: "Bookmarked" },
              { value: "APPLYING", label: "Applying" },
              { value: "APPLIED", label: "Applied" },
              { value: "INTERVIEWING", label: "Interviewing" },
              { value: "ACCEPTED", label: "Accepted" },
              { value: "ARCHIVED", label: "Archived" },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </Group>

        <Button
          variant="light"
          color="gray"
          size="xs"
          onClick={() => {
            setSearch("");
            setStatusFilter(null);
          }}
        >
          Reset Filters
        </Button>
      </Stack>

      <JobTable jobs={filteredJobs} />
    </Container>
  );
}
