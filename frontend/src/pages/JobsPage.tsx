import { Title, Container, Text } from "@mantine/core";
import JobTable from "../components/JobTable";

export default function JobsPage() {
  return (
    <Container>
      <Title order={2} mb="sm">
        Jobs
      </Title>
      <Text size="sm" c="dimmed" mb="md">
        Manage your tracked job applications below.
      </Text>
      <JobTable />
    </Container>
  );
}
