import { Table, Badge, Group, Text, Anchor } from "@mantine/core";
import { mockJobs } from "../api/mockJobs";

export default function JobTable() {
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

  const rows = mockJobs.map((job) => (
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

      <Table.Td>
        {job.location ? (
          <Text size="sm">{job.location}</Text>
        ) : (
          <Text c="dimmed" size="sm">
            —
          </Text>
        )}
      </Table.Td>

      <Table.Td>
        {job.pay_scale ? (
          <Text size="sm">{job.pay_scale}</Text>
        ) : (
          <Text c="dimmed" size="sm">
            —
          </Text>
        )}
      </Table.Td>

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
          <Table.Th>Position</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Priority</Table.Th>
          <Table.Th>Location</Table.Th>
          <Table.Th>Pay Scale</Table.Th>
          <Table.Th>Link</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
