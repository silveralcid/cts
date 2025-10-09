import {
  Stack,
  TextInput,
  Textarea,
  Select,
  NumberInput,
  Checkbox,
  Button,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createJob, updateJob } from "../api/jobs";
import { getCompanies } from "../api/companies";
import { useNavigate } from "react-router-dom";

interface JobFormProps {
  mode?: "create" | "edit";
  job?: any;
}

export default function JobForm({ mode = "create", job }: JobFormProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isEdit = mode === "edit";

  // Fetch companies for dropdown
  const { data: companies = [] } = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
  });

  const mutation = useMutation({
    mutationFn: isEdit ? (values: any) => updateJob(job.id, values) : createJob,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      navigate(`/jobs/${data.id}`);
    },
  });

  const form = useForm({
    initialValues: {
      company_id: job?.company?.id || "",
      position_title: job?.position_title || "",
      location: job?.location || "",
      employment_type: job?.employment_type || "",
      role_type: job?.role_type || "",
      is_remote: job?.is_remote || false,
      priority: job?.priority || 3,
      job_post_url: job?.job_post_url || "",
      about: job?.about || "",
      requirements: job?.requirements || "",
      responsibilities: job?.responsibilities || "",
      benefits: job?.benefits || "",
      salary_min: job?.salary_min || "",
      salary_max: job?.salary_max || "",
      salary_currency: job?.salary_currency || "USD",
      job_notes: job?.job_notes || "",
    },
    validate: {
      company_id: (value) => (!value ? "Company is required" : null),
      position_title: (value) =>
        !value.trim() ? "Position title is required" : null,
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

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Select
          label="Company"
          placeholder="Select company"
          data={companies.map((c) => ({ value: c.id, label: c.name }))}
          {...form.getInputProps("company_id")}
        />

        <TextInput
          label="Position Title"
          required
          {...form.getInputProps("position_title")}
        />

        <TextInput
          label="Location"
          placeholder="e.g. Remote, New York"
          {...form.getInputProps("location")}
        />

        <Checkbox
          label="Remote"
          {...form.getInputProps("is_remote", { type: "checkbox" })}
        />

        <TextInput
          label="Employment Type"
          placeholder="Full-time, Part-time..."
          {...form.getInputProps("employment_type")}
        />

        <Select
          label="Role Type"
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
          label="Job Post URL"
          placeholder="https://company.com/job"
          {...form.getInputProps("job_post_url")}
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

        <Select
          label="Currency"
          data={[
            { value: "USD", label: "USD" },
            { value: "EUR", label: "EUR" },
            { value: "GBP", label: "GBP" },
            { value: "CAD", label: "CAD" },
            { value: "AUD", label: "AUD" },
            { value: "JPY", label: "JPY" },
          ]}
          {...form.getInputProps("salary_currency")}
        />

        <Textarea
          label="About"
          autosize
          minRows={3}
          {...form.getInputProps("about")}
        />
        <Textarea
          label="Requirements"
          autosize
          minRows={3}
          {...form.getInputProps("requirements")}
        />
        <Textarea
          label="Responsibilities"
          autosize
          minRows={3}
          {...form.getInputProps("responsibilities")}
        />
        <Textarea
          label="Benefits"
          autosize
          minRows={3}
          {...form.getInputProps("benefits")}
        />
        <Textarea
          label="Notes"
          autosize
          minRows={3}
          {...form.getInputProps("job_notes")}
        />

        <Group justify="flex-end">
          <Button
            type="submit"
            loading={mutation.isPending}
            color={isEdit ? "teal" : "blue"}
          >
            {isEdit ? "Update Job" : "Create Job"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
