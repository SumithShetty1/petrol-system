import {
  Droplet,
  User,
  LayoutDashboard,
  Users,
  FileText,
  Search,
  Settings,
  Building2,
  UserCog,
  UserCheck,
} from "lucide-react";

// -----------------------------------
// ATTENDANT NAVIGATION
// -----------------------------------
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

// -----------------------------------
// MANAGER NAVIGATION
// -----------------------------------
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

// -----------------------------------
// OWNER NAVIGATION
// -----------------------------------
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
    label: "Managers",
    path: "/owner/managers",
    icon: UserCog,
  },
  {
    label: "Attendants",
    path: "/owner/attendants",
    icon: UserCheck,
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

// -----------------------------------
// ADMIN NAVIGATION
// -----------------------------------
export const adminNav = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Pumps",
    path: "/admin/pumps",
    icon: Building2,
  },
  {
    label: "Owners",
    path: "/admin/owners",
    icon: Users,
  },
  {
    label: "Transactions",
    path: "/admin/transactions",
    icon: FileText,
  },
  {
    label: "User",
    path: "/admin/users",
    icon: User,
  },
];
