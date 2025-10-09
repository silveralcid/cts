import { useQuery } from "@tanstack/react-query";
import { getCompanies } from "../api/companies";
import {
  Container,
  Title,
  Text,
  Loader,
  Center,
  Table,
  Button,
  Group,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

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
    <Container>
      <Group justify="space-between" mb="md">
        <Title order={2}>Companies</Title>
        <Button onClick={() => navigate("/companies/new")} color="blue">
          + New Company
        </Button>
      </Group>

      <Table highlightOnHover withTableBorder striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Website</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {companies.map((company) => (
            <Table.Tr
              key={company.id}
              onClick={() => navigate(`/companies/${company.id}`)}
              style={{ cursor: "pointer" }}
            >
              <Table.Td fw={500}>{company.name}</Table.Td>
              <Table.Td>
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {company.website}
                  </a>
                ) : (
                  "—"
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Container>
  );
}
