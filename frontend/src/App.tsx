import { AppShell, MantineProvider } from "@mantine/core";
import { Routes, Route } from "react-router-dom";
import { DatesProvider } from "@mantine/dates";
import "@mantine/dates/styles.css";
import "@mantine/core/styles.css";

import NavbarMinimal from "./components/NavbarMinimal";
import JobsPage from "./pages/JobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import CompanyPage from "./pages/CompanyPage";
import CompanyDetailPage from "./pages/CompanyDetailPage";
import CompanyCreatePage from "./pages/CompanyCreatePage";
import JobCreatePage from "./pages/JobCreatePage";
import CompanyEditPage from "./pages/CompanyEditPage";
import JobEditPage from "./pages/JobEditPage";

export default function App() {
  return (
    <MantineProvider>
      <DatesProvider settings={{ locale: "en", firstDayOfWeek: 1 }}>
        <AppShell
          navbar={{
            width: 80,
            breakpoint: "sm",
          }}
          padding="md"
        >
          <AppShell.Navbar p={0} withBorder={false}>
            <NavbarMinimal />
          </AppShell.Navbar>

          <AppShell.Main>
            <Routes>
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:id" element={<JobDetailPage />} />
              <Route path="/companies" element={<CompanyPage />} />
              <Route path="/companies/:id" element={<CompanyDetailPage />} />
              <Route path="/companies/new" element={<CompanyCreatePage />} />
              <Route path="/jobs/new" element={<JobCreatePage />} />
              <Route path="/companies/:id/edit" element={<CompanyEditPage />} />
              <Route path="/jobs/:id/edit" element={<JobEditPage />} />
            </Routes>
          </AppShell.Main>
        </AppShell>
      </DatesProvider>
    </MantineProvider>
  );
}
