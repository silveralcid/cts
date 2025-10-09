import { Container, Title } from "@mantine/core";
import CompanyForm from "./CompanyForm";

export default function CompanyCreatePage() {
  return (
    <Container size="sm" py="xl">
      <Title order={2} mb="md">
        Create New Company
      </Title>
      <CompanyForm mode="create" />
    </Container>
  );
}
