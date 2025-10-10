import { useState, useMemo } from "react";
import { Table, Group, Text } from "@mantine/core";
import { ArrowUp, ArrowDown } from "phosphor-react";
import { useNavigate } from "react-router-dom";
import type { Company } from "../types/company";

type SortKey = "name" | "website" | "created_at" | "updated_at";

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
      const aVal = a[sortKey] || "";
      const bVal = b[sortKey] || "";
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

          <Table.Th onClick={() => handleSort("website")}>
            <Group justify="space-between">
              <Text fw={600}>Website</Text>
              <SortIcon col="website" />
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
            <Table.Td>
              {company.created_at
                ? new Date(company.created_at).toLocaleDateString()
                : "—"}
            </Table.Td>
            <Table.Td>
              {company.updated_at
                ? new Date(company.updated_at).toLocaleDateString()
                : "—"}
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
