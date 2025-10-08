import { useState, useMemo } from "react";
import { Table, Badge, Group, Text, Anchor } from "@mantine/core";
import { ArrowUp, ArrowDown } from "phosphor-react";
import type { Job } from "../api/mockJobs";

type SortKey =
  | "position_title"
  | "status"
  | "priority"
  | "location"
  | "pay_scale";

export default function JobTable({ jobs }: { jobs: Job[] }) {
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

  // Helper for pay scale sorting
  const extractNumeric = (val?: string | null) => {
    if (!val) return 0;
    const match = val.match(/\d+/g);
    return match ? parseInt(match[0]) : 0;
  };

  const sortedJobs = useMemo(() => {
    return [...jobs].sort((a, b) => {
      let aVal: any = a[sortKey];
      let bVal: any = b[sortKey];

      if (sortKey === "pay_scale") {
        aVal = extractNumeric(a.pay_scale);
        bVal = extractNumeric(b.pay_scale);
      }

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

  const rows = sortedJobs.map((job) => (
    <Table.Tr key={job.id}>
      <Table.Td>
        <Group gap="xs">
          <Text fw={500}>{job.position_title}</Text>
          <Text c="dimmed" size="sm">
            at {job.company.name}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Badge color={statusColors[job.status] || "gray"}>{job.status}</Badge>
      </Table.Td>

      <Table.Td>{job.priority}</Table.Td>
      <Table.Td>{job.location ?? <Text c="dimmed">—</Text>}</Table.Td>
      <Table.Td>{job.pay_scale ?? <Text c="dimmed">—</Text>}</Table.Td>

      <Table.Td>
        {job.job_post_url ? (
          <Anchor href={job.job_post_url} target="_blank" size="sm">
            View Post
          </Anchor>
        ) : (
          <Text c="dimmed" size="sm">
            —
          </Text>
        )}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table highlightOnHover withTableBorder withColumnBorders striped>
      <Table.Thead>
        <Table.Tr>
          <Table.Th onClick={() => handleSort("position_title")}>
            <Group justify="space-between" align="center">
              <Text fw={600}>Position</Text>
              <SortIcon col="position_title" />
            </Group>
          </Table.Th>

          <Table.Th onClick={() => handleSort("status")}>
            <Group justify="space-between" align="center">
              <Text fw={600}>Status</Text>
              <SortIcon col="status" />
            </Group>
          </Table.Th>

          <Table.Th onClick={() => handleSort("priority")}>
            <Group justify="space-between" align="center">
              <Text fw={600}>Priority</Text>
              <SortIcon col="priority" />
            </Group>
          </Table.Th>

          <Table.Th onClick={() => handleSort("location")}>
            <Group justify="space-between" align="center">
              <Text fw={600}>Location</Text>
              <SortIcon col="location" />
            </Group>
          </Table.Th>

          <Table.Th onClick={() => handleSort("pay_scale")}>
            <Group justify="space-between" align="center">
              <Text fw={600}>Pay Scale</Text>
              <SortIcon col="pay_scale" />
            </Group>
          </Table.Th>

          <Table.Th>
            <Text fw={600}>Link</Text>
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
