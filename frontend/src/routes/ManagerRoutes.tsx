import { Routes, Route, Navigate } from "react-router-dom";

import RouteShell from "./RouteShell";

import PumpDashboard from "../pages/manager/PumpDashboard";
import AttendantsManagement from "../pages/manager/AttendantsManagement";
import PumpTransactions from "../pages/manager/PumpTransactions";
import CustomerLookup from "../pages/manager/CustomerLookup";
import ManagerSettings from "../pages/manager/ManagerSettings";

export default function ManagerRoutes() {
  return (
    <Routes>
      <Route
        element={
          <RouteShell
            allowedRoles={["manager"]}
            role="manager"
          />
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PumpDashboard />} />
        <Route path="attendants" element={<AttendantsManagement />} />
        <Route path="transactions" element={<PumpTransactions />} />
        <Route path="customers" element={<CustomerLookup />} />
        <Route path="settings" element={<ManagerSettings />} />
      </Route>
    </Routes>
  );
}
