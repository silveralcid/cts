import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getJobById } from "../api/jobs";
import { Container, Title, Loader, Center, Text } from "@mantine/core";
import JobForm from "./JobForm";

export default function JobEditPage() {
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
        <Text c="red">Failed to load job.</Text>
      </Center>
    );

  return (
    <Container size="sm" py="xl">
      <Title order={2} mb="md">
        Edit Job
      </Title>
      <JobForm mode="edit" job={job} />
    </Container>
  );
}
