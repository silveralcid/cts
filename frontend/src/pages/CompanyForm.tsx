import {
  Stack,
  TextInput,
  Textarea,
  Select,
  Checkbox,
  Button,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCompany, updateCompany } from "../api/companies";
import { useNavigate } from "react-router-dom";

interface CompanyFormProps {
  mode?: "create" | "edit";
  company?: any;
}

export default function CompanyForm({
  mode = "create",
  company,
}: CompanyFormProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const isEdit = mode === "edit";

  const form = useForm({
    initialValues: {
      name: company?.name || "",
      website: company?.website || "",
      notes: company?.notes || "",
      is_nonprofit: company?.is_nonprofit || false,
      industry: company?.industry || "",
      stage: company?.stage || "",
      funding: company?.funding || "",
      founding_year: company?.founding_year || "",
      size: company?.size || "",
      keywords: company?.keywords?.join(", ") || "",
    },
    validate: {
      name: (value) => (!value.trim() ? "Company name is required" : null),
    },
  });

  const mutation = useMutation({
    mutationFn: isEdit
      ? (values) => updateCompany(company.id, values)
      : createCompany,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      navigate(`/companies/${data.id}`);
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    // Convert comma-separated keywords to array
    const payload = {
      ...values,
      keywords: values.keywords
        ? values.keywords.split(",").map((k) => k.trim())
        : [],
    };
    mutation.mutate(payload);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Company Name"
          placeholder="Acme Corp"
          required
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Website"
          placeholder="https://example.com"
          {...form.getInputProps("website")}
        />
        <Checkbox
          label="Non-Profit Organization"
          {...form.getInputProps("is_nonprofit", { type: "checkbox" })}
        />
        <TextInput
          label="Industry"
          placeholder="Technology, Healthcare, Finance..."
          {...form.getInputProps("industry")}
        />
        <TextInput
          label="Stage"
          placeholder="Startup, Growth, Established..."
          {...form.getInputProps("stage")}
        />
        <TextInput
          label="Funding"
          placeholder="Series A, Bootstrapped, Public..."
          {...form.getInputProps("funding")}
        />
        <TextInput
          label="Founding Year"
          placeholder="e.g. 2018"
          {...form.getInputProps("founding_year")}
        />
        <Select
          label="Size"
          placeholder="Select size range"
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
          ].map((s) => ({ value: s, label: s }))}
          {...form.getInputProps("size")}
        />
        <Textarea
          label="Notes"
          placeholder="General company information..."
          {...form.getInputProps("notes")}
        />
        <TextInput
          label="Keywords"
          placeholder="Comma-separated tags (e.g., SaaS, remote-friendly)"
          {...form.getInputProps("keywords")}
        />

        <Group justify="flex-end">
          <Button
            type="submit"
            loading={mutation.isPending}
            color={isEdit ? "teal" : "blue"}
          >
            {isEdit ? "Update Company" : "Create Company"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
