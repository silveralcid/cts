import { Table, Badge, Group, Text } from "@mantine/core";

type Job = {
  id: string;
  title: string;
  company: string;
  status: string;
  priority: number;
};

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "Teal Corp",
    status: "Applied",
    priority: 4,
  },
  {
    id: "2",
    title: "Backend Engineer",
    company: "Huntr Labs",
    status: "Interviewing",
    priority: 5,
  },
  {
    id: "3",
    title: "Product Designer",
    company: "CareerFlow",
    status: "Bookmarked",
    priority: 3,
  },
];

export default function JobTable() {
  const rows = mockJobs.map((job) => (
    <Table.Tr key={job.id}>
      <Table.Td>
        <Group gap="xs">
          <Text fw={500}>{job.title}</Text>
          <Text c="dimmed" size="sm">
            ({job.company})
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge color={job.status === "Interviewing" ? "blue" : "gray"}>
          {job.status}
        </Badge>
      </Table.Td>
      <Table.Td>{job.priority}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Job</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Priority</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
