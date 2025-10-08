import { useState } from "react";
import {
  AppShell,
  Burger,
  Group,
  Title,
  ActionIcon,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { Sun, Moon, Briefcase } from "phosphor-react";
import { Routes, Route, Link } from "react-router-dom";

import JobsPage from "./pages/JobsPage";
import JobDetailPage from "./pages/JobDetailPage";

export default function App() {
  const [opened, setOpened] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 220,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={() => setOpened(!opened)}
              size="sm"
            />
            <Title order={3}>Career Tracking System</Title>
          </Group>
          <ActionIcon
            variant="subtle"
            size="lg"
            onClick={toggleColorScheme}
            aria-label="Toggle color scheme"
          >
            {colorScheme === "dark" ? (
              <Sun size={20} weight="fill" />
            ) : (
              <Moon size={20} weight="fill" />
            )}
          </ActionIcon>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        <Group component={Link} to="/jobs" style={{ cursor: "pointer" }}>
          <Briefcase size={18} />
          <Text fw={500}>Jobs</Text>
        </Group>
      </AppShell.Navbar>

      <AppShell.Main>
        <Routes>
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
}
