import { useState, useMemo } from "react";
import { Table, Group, Text, Badge } from "@mantine/core";
import { ArrowUp, ArrowDown } from "phosphor-react";
import { useNavigate } from "react-router-dom";
import type { Company } from "../types/company";

type SortKey =
  | "name"
  | "industry"
  | "stage"
  | "funding"
  | "size"
  | "founding_year"
  | "is_nonprofit"
  | "created_at"
  | "updated_at";

export default function CompanyTable({ companies }: { companies: Company[] }) {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedCompanies = useMemo(() => {
    return [...companies].sort((a, b) => {
      let aVal: any = a[sortKey];
      let bVal: any = b[sortKey];

      // Handle booleans as 1/0
      if (typeof aVal === "boolean") aVal = aVal ? 1 : 0;
      if (typeof bVal === "boolean") bVal = bVal ? 1 : 0;

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [companies, sortKey, sortOrder]);

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortOrder === "asc" ? (
        <ArrowUp size={14} />
      ) : (
        <ArrowDown size={14} />
      )
    ) : null;

  const formatDate = (val?: string | null) =>
    val ? new Date(val).toLocaleDateString() : "—";

  return (
    <Table highlightOnHover withTableBorder withColumnBorders striped>
      <Table.Thead>
        <Table.Tr>
          <Table.Th onClick={() => handleSort("name")}>
            <Group justify="space-between">
              <Text fw={600}>Name</Text>
              <SortIcon col="name" />
            </Group>
          </Table.Th>

          <Table.Th onClick={() => handleSort("industry")}>
            <Group justify="space-between">
              <Text fw={600}>Industry</Text>
              <SortIcon col="industry" />
            </Group>
          </Table.Th>

          <Table.Th onClick={() => handleSort("stage")}>
            <Group justify="space-between">
              <Text fw={600}>Stage</Text>
              <SortIcon col="stage" />
            </Group>
          </Table.Th>

          <Table.Th onClick={() => handleSort("funding")}>
            <Group justify="space-between">
              <Text fw={600}>Funding</Text>
              <SortIcon col="funding" />
            </Group>
          </Table.Th>

          <Table.Th onClick={() => handleSort("size")}>
            <Group justify="space-between">
              <Text fw={600}>Size</Text>
              <SortIcon col="size" />
            </Group>
          </Table.Th>

          <Table.Th onClick={() => handleSort("is_nonprofit")}>
            <Group justify="space-between">
              <Text fw={600}>Nonprofit</Text>
              <SortIcon col="is_nonprofit" />
            </Group>
          </Table.Th>

          <Table.Th onClick={() => handleSort("founding_year")}>
            <Group justify="space-between">
              <Text fw={600}>Founded</Text>
              <SortIcon col="founding_year" />
            </Group>
          </Table.Th>

          <Table.Th onClick={() => handleSort("created_at")}>
            <Group justify="space-between">
              <Text fw={600}>Created</Text>
              <SortIcon col="created_at" />
            </Group>
          </Table.Th>

          <Table.Th onClick={() => handleSort("updated_at")}>
            <Group justify="space-between">
              <Text fw={600}>Updated</Text>
              <SortIcon col="updated_at" />
            </Group>
          </Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {sortedCompanies.map((company) => (
          <Table.Tr
            key={company.id}
            onClick={() => navigate(`/companies/${company.id}`)}
            style={{ cursor: "pointer" }}
          >
            <Table.Td fw={500}>{company.name ?? "—"}</Table.Td>
            <Table.Td>{company.industry ?? "—"}</Table.Td>
            <Table.Td>{company.stage ?? "—"}</Table.Td>
            <Table.Td>{company.funding ?? "—"}</Table.Td>
            <Table.Td>{company.size ?? "—"}</Table.Td>
            <Table.Td>
              <Badge color={company.is_nonprofit ? "green" : "gray"}>
                {company.is_nonprofit ? "Yes" : "No"}
              </Badge>
            </Table.Td>
            <Table.Td>{company.founding_year ?? "—"}</Table.Td>
            <Table.Td>{formatDate(company.created_at)}</Table.Td>
            <Table.Td>{formatDate(company.updated_at)}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
