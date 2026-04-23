import AppLayout from "./AppLayout";
import {
  attendantNav,
  managerNav,
  ownerNav,
} from "../config/navConfig";

const roleConfig = {
  attendant: {
    navItems: attendantNav,
    paddingBottom: "pb-16",
  },

  manager: {
    navItems: managerNav,
    paddingBottom: "pb-20",
  },

  owner: {
    navItems: ownerNav,
    paddingBottom: "pb-20",
  },
};

type Props = {
  role: keyof typeof roleConfig;
  children: React.ReactNode;
};

export default function RoleLayout({
  role,
  children,
}: Props) {
  const current = roleConfig[role];

  return (
    <AppLayout
      navItems={current.navItems}
      paddingBottom={current.paddingBottom}
    >
      {children}
    </AppLayout>
  );
}
