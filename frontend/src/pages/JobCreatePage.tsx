import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createJob } from "../api/jobs";
import { getCompanies } from "../api/companies";
import { createCompany } from "../api/companies";
import { modals } from "@mantine/modals";
import {
  Container,
  Title,
  TextInput,
  Textarea,
  Select,
  Button,
  Stack,
  NumberInput,
  Checkbox,
  Loader,
  Center,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";

export default function JobCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ✅ Fetch companies for dropdown
  const {
    data: companies = [],
    isLoading: loadingCompanies,
    isError,
  } = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
  });

  const mutation = useMutation({
    mutationFn: createJob,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      navigate(`/jobs/${data.id}`);
    },
  });

  const createCompanyMutation = useMutation({
    mutationFn: createCompany,
    onSuccess: (data) => {
      // Replace optimistic entry with the real one
      queryClient.setQueryData(["companies"], (old: any) =>
        old ? old.map((c: any) => (c.id === data.name ? data : c)) : [data]
      );

      // Re-select the correct one by real ID
      form.setFieldValue("company_id", data.id);
    },
  });

  const handleCreateCompany = (name: string) => {
    createCompanyMutation.mutate({ name });
  };

  const form = useForm({
    initialValues: {
      company_id: "",
      position_title: "",
      location: "",
      employment_type: "",
      role_type: "",
      is_remote: false,
      priority: 3,
      job_post_url: "",
      about: "",
      requirements: "",
      responsibilities: "",
      benefits: "",
      salary_min: "",
      salary_max: "",
      salary_currency: "USD",
      job_notes: "",
    },
    validate: {
      company_id: (value) => (!value ? "Company is required" : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    mutation.mutate({
      ...values,
      priority: Number(values.priority),
      salary_min: values.salary_min ? Number(values.salary_min) : null,
      salary_max: values.salary_max ? Number(values.salary_max) : null,
    });
  };

  if (loadingCompanies)
    return (
      <Center mt="xl">
        <Loader />
      </Center>
    );

  if (isError)
    return (
      <Center mt="xl">
        <Title order={4} c="red">
          Failed to load companies.
        </Title>
      </Center>
    );

  const openCreateCompanyModal = () => {
    let nameValue = "";
    let websiteValue = "";

    modals.openConfirmModal({
      title: "Create New Company",
      centered: true,
      labels: { confirm: "Create", cancel: "Cancel" },
      confirmProps: { color: "blue" },
      children: (
        <Stack>
          <TextInput
            label="Company Name"
            placeholder="Acme Inc."
            required
            onChange={(e) => (nameValue = e.currentTarget.value)}
          />
          <TextInput
            label="Website (optional)"
            placeholder="https://example.com"
            onChange={(e) => (websiteValue = e.currentTarget.value)}
          />
        </Stack>
      ),
      onConfirm: () => {
        if (!nameValue.trim()) return;

        createCompanyMutation.mutate(
          { name: nameValue, website: websiteValue || null },
          {
            onSuccess: (data) => {
              queryClient.invalidateQueries({ queryKey: ["companies"] });
              form.setFieldValue("company_id", data.id);
            },
          }
        );
      },
    });
  };

  return (
    <Container size="sm" py="xl">
      <Title order={2} mb="md">
        Create New Job
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Group align="flex-end">
            <Select
              label="Company"
              placeholder="Select existing company"
              searchable
              clearable
              required
              error={form.errors.company_id}
              data={companies.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
              {...form.getInputProps("company_id")}
            />

            <Button variant="light" onClick={() => openCreateCompanyModal()}>
              + New
            </Button>
          </Group>

          <TextInput
            label="Position Title"
            placeholder="e.g. Software Engineer"
            required
            {...form.getInputProps("position_title")}
          />

          <TextInput
            label="Job Post URL"
            placeholder="https://company.com/job"
            required
            {...form.getInputProps("job_post_url")}
          />

          <TextInput
            label="Location"
            placeholder="e.g. Remote, New York, NY"
            {...form.getInputProps("location")}
          />

          <Checkbox
            label="Remote"
            {...form.getInputProps("is_remote", { type: "checkbox" })}
          />

          <TextInput
            label="Employment Type"
            placeholder="Full-time, Part-time, Contract..."
            {...form.getInputProps("employment_type")}
          />

          <Select
            label="Role Type"
            placeholder="Select role type"
            data={[
              { value: "IC", label: "Individual Contributor" },
              { value: "MANAGER", label: "People Manager" },
              { value: "EXECUTIVE", label: "Executive / Leadership" },
            ]}
            {...form.getInputProps("role_type")}
          />

          <NumberInput
            label="Priority"
            min={1}
            max={5}
            {...form.getInputProps("priority")}
          />

          <TextInput
            label="Salary Currency"
            placeholder="USD"
            {...form.getInputProps("salary_currency")}
          />

          <Group grow>
            <NumberInput
              label="Salary Min"
              min={0}
              {...form.getInputProps("salary_min")}
            />
            <NumberInput
              label="Salary Max"
              min={0}
              {...form.getInputProps("salary_max")}
            />
          </Group>

          <Textarea
            label="About"
            placeholder="Company and job overview..."
            autosize
            minRows={3}
            {...form.getInputProps("about")}
          />

          <Textarea
            label="Requirements"
            placeholder="Required skills, experience..."
            autosize
            minRows={3}
            {...form.getInputProps("requirements")}
          />

          <Textarea
            label="Responsibilities"
            placeholder="Daily responsibilities, deliverables..."
            autosize
            minRows={3}
            {...form.getInputProps("responsibilities")}
          />

          <Textarea
            label="Benefits"
            placeholder="Perks, benefits, bonuses..."
            autosize
            minRows={3}
            {...form.getInputProps("benefits")}
          />

          <Textarea
            label="Notes"
            placeholder="Private notes or follow-up details..."
            autosize
            minRows={3}
            {...form.getInputProps("job_notes")}
          />

          <Button
            type="submit"
            loading={mutation.isPending}
            disabled={mutation.isPending}
          >
            Create Job
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
