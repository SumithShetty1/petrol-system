import { Routes, Route, Navigate } from "react-router-dom";

import RouteShell from "./RouteShell";

import OwnerDashboard from "../pages/owner/OwnerDashboard";
import OwnerPumps from "../pages/owner/OwnerPumps";
import OwnerPumpDetails from "../pages/owner/OwnerPumpDetails";
import OwnerTransactions from "../pages/owner/OwnerTransactions";
import OwnerProfile from "../pages/owner/OwnerProfile";

export default function OwnerRoutes() {
  return (
    <Routes>
      <Route
        element={
          <RouteShell
            allowedRoles={["owner"]}
            role="owner"
          />
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="pumps" element={<OwnerPumps />} />
        <Route path="pumps/:id" element={<OwnerPumpDetails />} />
        <Route path="transactions" element={<OwnerTransactions />} />
        <Route path="profile" element={<OwnerProfile />} />
      </Route>
    </Routes>
  );
}