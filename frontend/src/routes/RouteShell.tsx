import { Outlet } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleLayout from "../layouts/RoleLayout";

type Props = {
  allowedRoles: string[];
  role: "attendant" | "manager" | "owner";
};

export default function RouteShell({
  allowedRoles,
  role,
}: Props) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <RoleLayout role={role}>
        <Outlet />
      </RoleLayout>
    </ProtectedRoute>
  );
}
