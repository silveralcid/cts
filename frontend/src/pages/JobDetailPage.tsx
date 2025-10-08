import { useParams } from "react-router-dom";
import { Title, Text, Container } from "@mantine/core";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <Container>
      <Title order={2}>Job Details</Title>
      <Text c="dimmed" mt="sm">
        This is where we’ll show full info for job <b>{id}</b>.
      </Text>
    </Container>
  );
}
