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
  Popover,
  Checkbox,
} from "@mantine/core";
import { MagnifyingGlass } from "phosphor-react";
import { useQuery } from "@tanstack/react-query";
import { getJobs } from "../api/jobs";
import JobTable from "../components/JobTable";
import { useNavigate } from "react-router-dom";

export default function JobsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [columnsPopoverOpened, setColumnsPopoverOpened] = useState(false);

  // 🔥 Fetch data with React Query
  const {
    data: jobs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });

  // ✅ column visibility state
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "position_title",
    "company",
    "status",
    "priority",
    "location",
    "is_remote",
    "salary_min",
    "salary_max",
    "date_posted",
    "date_applied",
    "date_follow_up",
    "date_deadline",
    "updated_at",
  ]);

  const toggleColumn = (col: string) => {
    setVisibleColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const columns = [
    { key: "priority", label: "Priority" },
    { key: "salary_min", label: "Min. Salary" },
    { key: "salary_max", label: "Max. Salary" },
    { key: "location", label: "Location" },
    { key: "is_remote", label: "Remote" },
    { key: "status", label: "Status" },
    { key: "date_posted", label: "Date Posted" },
    { key: "date_applied", label: "Date Applied" },
    { key: "date_follow_up", label: "Follow Up" },
    { key: "date_deadline", label: "Deadline" },
    { key: "updated_at", label: "Last Updated" },
  ];

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
    <Container fluid p="md">
      {/* =========================
          Header Row
      ========================== */}
      <Group justify="space-between" mb="md">
        <Title order={2}>Jobs</Title>

        <Group>
          {/* Columns button popover */}
          <Popover
            opened={columnsPopoverOpened}
            onChange={setColumnsPopoverOpened}
            position="bottom-end"
            withArrow
            shadow="md"
          >
            <Popover.Target>
              <Button
                variant="light"
                onClick={() => setColumnsPopoverOpened((o) => !o)}
              >
                Columns
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Stack gap="xs">
                {columns.map((col) => (
                  <Checkbox
                    key={col.key}
                    label={col.label}
                    checked={visibleColumns.includes(col.key)}
                    onChange={() => toggleColumn(col.key)}
                  />
                ))}
              </Stack>
            </Popover.Dropdown>
          </Popover>

          <Button onClick={() => navigate("/jobs/new")} color="blue">
            + New Job
          </Button>
        </Group>
      </Group>

      {/* =========================
          Filters
      ========================== */}
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

      {/* =========================
          Job Table
      ========================== */}
      <JobTable jobs={filteredJobs} visibleColumns={visibleColumns} />
    </Container>
  );
}
