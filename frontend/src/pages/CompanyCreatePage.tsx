import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createCompany } from "../api/companies";
import {
  Container,
  Title,
  TextInput,
  Button,
  Stack,
  Checkbox,
  Textarea,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";

export default function CompanyCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      name: "",
      website: "",
      is_nonprofit: false,
      industry: "",
      stage: "",
      funding: "",
      founding_year: "",
      size: "",
      notes: "",
      keywords: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createCompany,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      navigate(`/companies/${data.id}`);
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    const formatted = {
      ...values,
      keywords: values.keywords
        ? values.keywords.split(",").map((k) => k.trim())
        : [],
      founding_year: values.founding_year ? Number(values.founding_year) : null,
    };
    mutation.mutate(formatted);
  };

  return (
    <Container size="sm" py="xl">
      <Title order={2} mb="md">
        Create New Company
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Company Name"
            placeholder="Acme Inc."
            required
            {...form.getInputProps("name")}
          />

          <TextInput
            label="Website"
            placeholder="https://example.com"
            {...form.getInputProps("website")}
          />

          <Checkbox
            label="Non-profit Organization"
            {...form.getInputProps("is_nonprofit", { type: "checkbox" })}
          />

          <TextInput
            label="Industry"
            placeholder="Technology, Finance, etc."
            {...form.getInputProps("industry")}
          />

          <TextInput
            label="Stage"
            placeholder="Seed, Series A, Public..."
            {...form.getInputProps("stage")}
          />

          <TextInput
            label="Funding"
            placeholder="$5M VC, bootstrapped, etc."
            {...form.getInputProps("funding")}
          />

          <TextInput
            label="Founding Year"
            placeholder="e.g. 2015"
            {...form.getInputProps("founding_year")}
          />

          <Select
            label="Size"
            data={[
              "1-10",
              "11-50",
              "51-200",
              "201-500",
              "501-1000",
              "1001-2000",
              "2001-5000",
              "5001-10000",
              "10001+",
            ]}
            placeholder="Select company size"
            {...form.getInputProps("size")}
          />

          <TextInput
            label="Keywords"
            placeholder="comma,separated,tags"
            {...form.getInputProps("keywords")}
          />

          <Textarea
            label="Notes"
            placeholder="Any additional notes..."
            autosize
            minRows={3}
            {...form.getInputProps("notes")}
          />

          <Button
            type="submit"
            loading={mutation.isPending}
            disabled={mutation.isPending}
          >
            Create Company
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
