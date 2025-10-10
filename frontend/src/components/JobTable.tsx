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

interface JobTableProps {
  jobs: Job[];
  visibleColumns: string[];
}

export default function JobTable({ jobs, visibleColumns }: JobTableProps) {
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
      {visibleColumns.includes("position_title") && (
        <Table.Td>{job.position_title ?? "—"}</Table.Td>
      )}
      {visibleColumns.includes("company") && (
        <Table.Td>{job.company?.name ?? "—"}</Table.Td>
      )}
      {visibleColumns.includes("status") && (
        <Table.Td>
          <Badge color={statusColors[job.status] || "gray"}>{job.status}</Badge>
        </Table.Td>
      )}
      {visibleColumns.includes("priority") && (
        <Table.Td>{job.priority ?? "—"}</Table.Td>
      )}
      {visibleColumns.includes("location") && (
        <Table.Td>{job.location ?? "—"}</Table.Td>
      )}
      {visibleColumns.includes("is_remote") && (
        <Table.Td>
          <Badge color={job.is_remote ? "green" : "gray"}>
            {job.is_remote ? "Remote" : "On-site"}
          </Badge>
        </Table.Td>
      )}
      {visibleColumns.includes("salary_min") && (
        <Table.Td>
          {job.salary_min ? `$${job.salary_min.toLocaleString()}` : "—"}
        </Table.Td>
      )}
      {visibleColumns.includes("salary_max") && (
        <Table.Td>
          {job.salary_max ? `$${job.salary_max.toLocaleString()}` : "—"}
        </Table.Td>
      )}
      {visibleColumns.includes("date_posted") && (
        <Table.Td>{formatDate(job.date_posted)}</Table.Td>
      )}
      {visibleColumns.includes("date_applied") && (
        <Table.Td>{formatDate(job.date_applied)}</Table.Td>
      )}
      {visibleColumns.includes("date_follow_up") && (
        <Table.Td>{formatDate(job.date_follow_up)}</Table.Td>
      )}
      {visibleColumns.includes("date_deadline") && (
        <Table.Td>{formatDate(job.date_deadline)}</Table.Td>
      )}
      {visibleColumns.includes("updated_at") && (
        <Table.Td>{formatDate(job.updated_at)}</Table.Td>
      )}
    </Table.Tr>
  ));

  return (
    <Table highlightOnHover withTableBorder withColumnBorders striped>
      <Table.Thead>
        <Table.Tr>
          {visibleColumns.includes("position_title") && (
            <Table.Th onClick={() => handleSort("position_title")}>
              <Group justify="space-between">
                <Text fw={600}>Position</Text>
                <SortIcon col="position_title" />
              </Group>
            </Table.Th>
          )}

          {visibleColumns.includes("company") && (
            <Table.Th onClick={() => handleSort("company")}>
              <Group justify="space-between">
                <Text fw={600}>Company</Text>
                <SortIcon col="company" />
              </Group>
            </Table.Th>
          )}

          {visibleColumns.includes("status") && (
            <Table.Th onClick={() => handleSort("status")}>
              <Group justify="space-between">
                <Text fw={600}>Status</Text>
                <SortIcon col="status" />
              </Group>
            </Table.Th>
          )}

          {visibleColumns.includes("priority") && (
            <Table.Th onClick={() => handleSort("priority")}>
              <Group justify="space-between">
                <Text fw={600}>Priority</Text>
                <SortIcon col="priority" />
              </Group>
            </Table.Th>
          )}

          {visibleColumns.includes("location") && (
            <Table.Th onClick={() => handleSort("location")}>
              <Group justify="space-between">
                <Text fw={600}>Location</Text>
                <SortIcon col="location" />
              </Group>
            </Table.Th>
          )}

          {visibleColumns.includes("is_remote") && (
            <Table.Th onClick={() => handleSort("is_remote")}>
              <Group justify="space-between">
                <Text fw={600}>Remote</Text>
                <SortIcon col="is_remote" />
              </Group>
            </Table.Th>
          )}

          {visibleColumns.includes("salary_min") && (
            <Table.Th onClick={() => handleSort("salary_min")}>
              <Group justify="space-between">
                <Text fw={600}>Min Salary</Text>
                <SortIcon col="salary_min" />
              </Group>
            </Table.Th>
          )}

          {visibleColumns.includes("salary_max") && (
            <Table.Th onClick={() => handleSort("salary_max")}>
              <Group justify="space-between">
                <Text fw={600}>Max Salary</Text>
                <SortIcon col="salary_max" />
              </Group>
            </Table.Th>
          )}

          {visibleColumns.includes("date_posted") && (
            <Table.Th onClick={() => handleSort("date_posted")}>
              <Group justify="space-between">
                <Text fw={600}>Date Posted</Text>
                <SortIcon col="date_posted" />
              </Group>
            </Table.Th>
          )}

          {visibleColumns.includes("date_applied") && (
            <Table.Th onClick={() => handleSort("date_applied")}>
              <Group justify="space-between">
                <Text fw={600}>Date Applied</Text>
                <SortIcon col="date_applied" />
              </Group>
            </Table.Th>
          )}

          {visibleColumns.includes("date_follow_up") && (
            <Table.Th onClick={() => handleSort("date_follow_up")}>
              <Group justify="space-between">
                <Text fw={600}>Follow Up</Text>
                <SortIcon col="date_follow_up" />
              </Group>
            </Table.Th>
          )}

          {visibleColumns.includes("date_deadline") && (
            <Table.Th onClick={() => handleSort("date_deadline")}>
              <Group justify="space-between">
                <Text fw={600}>Deadline</Text>
                <SortIcon col="date_deadline" />
              </Group>
            </Table.Th>
          )}

          {visibleColumns.includes("updated_at") && (
            <Table.Th onClick={() => handleSort("updated_at")}>
              <Group justify="space-between">
                <Text fw={600}>Last Updated</Text>
                <SortIcon col="updated_at" />
              </Group>
            </Table.Th>
          )}
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
