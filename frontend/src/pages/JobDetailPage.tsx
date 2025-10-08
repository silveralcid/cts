import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getJobById } from "../api/jobs";
import { Container, Title, Text, Loader, Center } from "@mantine/core";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: job,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["job", id],
    queryFn: () => getJobById(id!),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <Center mt="xl">
        <Loader />
      </Center>
    );

  if (isError || !job)
    return (
      <Center mt="xl">
        <Text c="red">Job not found.</Text>
      </Center>
    );

  return (
    <Container>
      <Title order={2}>{job.position_title}</Title>
      <Text c="dimmed" mt="xs">
        {job.company.name}
      </Text>
      <Text mt="md">{job.about || "No description available."}</Text>
    </Container>
  );
}
