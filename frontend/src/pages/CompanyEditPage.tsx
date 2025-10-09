import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCompanyById } from "../api/companies";
import { Container, Title, Loader, Center, Text } from "@mantine/core";
import CompanyForm from "./CompanyForm";

export default function CompanyEditPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: company,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["company", id],
    queryFn: () => getCompanyById(id!),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <Center mt="xl">
        <Loader />
      </Center>
    );

  if (isError || !company)
    return (
      <Center mt="xl">
        <Text c="red">Failed to load company.</Text>
      </Center>
    );

  return (
    <Container size="sm" py="xl">
      <Title order={2} mb="md">
        Edit Company
      </Title>
      <CompanyForm mode="edit" company={company} />
    </Container>
  );
}
