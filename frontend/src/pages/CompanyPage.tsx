import { useQuery } from "@tanstack/react-query";
import { getCompanies } from "../api/companies";
import {
  Container,
  Title,
  Text,
  Loader,
  Center,
  Button,
  Group,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import CompanyTable from "../components/CompanyTable";

export default function CompanyPage() {
  const navigate = useNavigate();
  const {
    data: companies = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
  });

  if (isLoading)
    return (
      <Center mt="xl">
        <Loader />
      </Center>
    );

  if (isError)
    return (
      <Center mt="xl">
        <Text c="red">Failed to load companies.</Text>
      </Center>
    );

  return (
    <Container fluid>
      <Group justify="space-between" mb="md">
        <Title order={2}>Companies</Title>
        <Button onClick={() => navigate("/companies/new")} color="blue">
          + New Company
        </Button>
      </Group>

      <CompanyTable companies={companies} />
    </Container>
  );
}
