import { useState, useMemo } from "react";
import { Table, Badge, Group, Text } from "@mantine/core";
import { ArrowUp, ArrowDown } from "phosphor-react";
import { useNavigate } from "react-router-dom";
import type { Job } from "../types/job";

type SortKey =
  | "position_title"
  | "company"
  | "status"
  | "priority"
  | "location"
  | "is_remote"
  | "salary_min"
  | "salary_max"
  | "date_posted"
  | "date_applied"
  | "date_follow_up"
  | "date_deadline"
  | "updated_at";

export default function JobTable({ jobs }: { jobs: Job[] }) {
  const navigate = useNavigate();

  const [sortKey, setSortKey] = useState<SortKey>("priority");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedJobs = useMemo(() => {
    return [...jobs].sort((a, b) => {
      let aVal: any;
      let bVal: any;

      if (sortKey === "company") {
        aVal = a.company?.name || "";
        bVal = b.company?.name || "";
      } else {
        aVal = a[sortKey];
        bVal = b[sortKey];
      }

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [jobs, sortKey, sortOrder]);

  const statusColors: Record<string, string> = {
    BOOKMARKED: "gray",
    APPLYING: "yellow",
    APPLIED: "blue",
    INTERVIEWING: "cyan",
    NEGOTIATING: "orange",
    ACCEPTED: "green",
    WITHDREW: "grape",
    NOT_ACCEPTED: "red",
    NO_RESPONSE: "red",
    ARCHIVED: "dark",
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortOrder === "asc" ? (
        <ArrowUp size={14} />
      ) : (
        <ArrowDown size={14} />
      )
    ) : null;

  const formatDate = (val?: string | null) =>
    val ? new Date(val).toLocaleDateString() : "—";

  const rows = sortedJobs.map((job) => (
    <Table.Tr
      key={job.id}
      onClick={() => navigate(`/jobs/${job.id}`)}
      style={{ cursor: "pointer" }}
    >
      <Table.Td>{job.position_title ?? "—"}</Table.Td>
      <Table.Td>{job.company?.name ?? "—"}</Table.Td>

      <Table.Td>
        <Badge color={statusColors[job.status] || "gray"}>{job.status}</Badge>
      </Table.Td>

      <Table.Td>{job.priority ?? "—"}</Table.Td>
      <Table.Td>{job.location ?? "—"}</Table.Td>
      <Table.Td>
        <Badge color={job.is_remote ? "green" : "gray"}>
          {job.is_remote ? "Remote" : "On-site"}
        </Badge>
      </Table.Td>
      <Table.Td>
        {job.salary_min ? `$${job.salary_min.toLocaleString()}` : "—"}
      </Table.Td>
      <Table.Td>
        {job.salary_max ? `$${job.salary_max.toLocaleString()}` : "—"}
      </Table.Td>
      <Table.Td>{formatDate(job.date_posted)}</Table.Td>
      <Table.Td>{formatDate(job.date_applied)}</Table.Td>
      <Table.Td>{formatDate(job.date_follow_up)}</Table.Td>
      <Table.Td>{formatDate(job.date_deadline)}</Table.Td>
      <Table.Td>{formatDate(job.updated_at)}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table highlightOnHover withTableBorder withColumnBorders striped>
      <Table.Thead>
        <Table.Tr>
          <Table.Th onClick={() => handleSort("position_title")}>
            <Group justify="space-between">
              <Text fw={600}>Position</Text>
              <SortIcon col="position_title" />
            </Group>
          </Table.Th>

          <Table.Th onClick={() => handleSort("company")}>
            <Group justify="space-between">
              <Text fw={600}>Company</Text>
              <SortIcon col="company" />
            </Group>
          </Table.Th>

          <Table.Th onClick={() => handleSort("status")}>
            <Group justify="space-between">
              <Text fw={600}>Status</Text>
              <SortIcon col="status" />
            </Group>
          </Table.Th>

          <Table.Th onClick={() => handleSort("priority")}>
            <Group justify="space-between">
              <Text fw={600}>Priority</Text>
              <SortIcon col="priority" />
            </Group>
          </Table.Th>

          <Table.Th onClick={() => handleSort("location")}>
            <Group justify="space-between">
              <Text fw={600}>Location</Text>
              <SortIcon col="location" />
            </Group>
          </Table.Th>

          <Table.Th onClick={() => handleSort("is_remote")}>
            <Group justify="space-between">
              <Text fw={600}>Remote</Text>
              <SortIcon col="is_remote" />
            </Group>
          </Table.Th>

          <Table.Th onClick={() => handleSort("salary_min")}>
            <Group justify="space-between">
              <Text fw={600}>Min Salary</Text>
              <SortIcon col="salary_min" />
            </Group>
          </Table.Th>

          <Table.Th onClick={() => handleSort("salary_max")}>
            <Group justify="space-between">
              <Text fw={600}>Max Salary</Text>
              <SortIcon col="salary_max" />
            </Group>
          </Table.Th>

          <Table.Th onClick={() => handleSort("date_posted")}>
            <Group justify="space-between">
              <Text fw={600}>Date Posted</Text>
              <SortIcon col="date_posted" />
            </Group>
          </Table.Th>

          <Table.Th onClick={() => handleSort("date_applied")}>
            <Group justify="space-between">
              <Text fw={600}>Date Applied</Text>
              <SortIcon col="date_applied" />
            </Group>
          </Table.Th>

          <Table.Th onClick={() => handleSort("date_follow_up")}>
            <Group justify="space-between">
              <Text fw={600}>Follow Up</Text>
              <SortIcon col="date_follow_up" />
            </Group>
          </Table.Th>

          <Table.Th onClick={() => handleSort("date_deadline")}>
            <Group justify="space-between">
              <Text fw={600}>Deadline</Text>
              <SortIcon col="date_deadline" />
            </Group>
          </Table.Th>

          <Table.Th onClick={() => handleSort("updated_at")}>
            <Group justify="space-between">
              <Text fw={600}>Last Updated</Text>
              <SortIcon col="updated_at" />
            </Group>
          </Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
