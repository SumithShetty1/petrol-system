import {
  Droplet,
  User,
  LayoutDashboard,
  Users,
  FileText,
  Search,
  Settings,
  Fuel,
  Building2,
} from "lucide-react";

export const attendantNav = [
  {
    label: "Transaction",
    path: "/attendant/transaction",
    icon: Droplet,
  },
  {
    label: "Profile",
    path: "/attendant/profile",
    icon: User,
  },
];

export const managerNav = [
  {
    label: "Dashboard",
    path: "/manager/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Attendants",
    path: "/manager/attendants",
    icon: Users,
  },
  {
    label: "Transactions",
    path: "/manager/transactions",
    icon: FileText,
  },
  {
    label: "Customers",
    path: "/manager/customers",
    icon: Search,
  },
  {
    label: "Settings",
    path: "/manager/settings",
    icon: Settings,
  },
];

export const ownerNav = [
  {
    label: "Dashboard",
    path: "/owner/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Pumps",
    path: "/owner/pumps",
    icon: Building2,
  },
  {
    label: "Transactions",
    path: "/owner/transactions",
    icon: FileText,
  },
  {
    label: "Profile",
    path: "/owner/profile",
    icon: User,
  },
];
