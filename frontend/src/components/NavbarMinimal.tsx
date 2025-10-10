import {
  Tooltip,
  UnstyledButton,
  Stack,
  Center,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import {
  Briefcase,
  Buildings,
  Plus,
  Gear,
  SignOut,
  Sun,
  Moon,
} from "phosphor-react";
import { Link, useLocation } from "react-router-dom";
import classes from "./NavbarMinimal.module.css";

interface NavbarLinkProps {
  icon: React.ElementType;
  label: string;
  to?: string;
  active?: boolean;
  onClick?: () => void;
}

function NavbarLink({
  icon: Icon,
  label,
  to,
  active,
  onClick,
}: NavbarLinkProps) {
  const Component = to ? Link : "button";
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        component={Component as any}
        to={to}
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon size={20} weight="fill" />
      </UnstyledButton>
    </Tooltip>
  );
}

export default function NavbarMinimal() {
  const location = useLocation();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const navItems = [
    { icon: Briefcase, label: "Jobs", to: "/jobs" },
    { icon: Buildings, label: "Companies", to: "/companies" },
    { icon: Plus, label: "Add Job", to: "/jobs/new" },
    { icon: Gear, label: "Settings", to: "/settings" },
  ];

  return (
    <nav className={classes.navbar}>
      <Center>
        <Link to="/jobs">
          <Briefcase size={28} weight="fill" />
        </Link>
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {navItems.map((item) => (
            <NavbarLink
              key={item.to}
              {...item}
              active={location.pathname.startsWith(item.to)}
            />
          ))}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <Tooltip
          label={`Switch to ${colorScheme === "dark" ? "light" : "dark"} mode`}
          position="right"
        >
          <ActionIcon
            variant="subtle"
            size="lg"
            onClick={toggleColorScheme}
            className={classes.link}
          >
            {colorScheme === "dark" ? (
              <Sun size={20} weight="fill" />
            ) : (
              <Moon size={20} weight="fill" />
            )}
          </ActionIcon>
        </Tooltip>

        <NavbarLink icon={SignOut} label="Logout" to="#" />
      </Stack>
    </nav>
  );
}
