import { Routes, Route, Navigate } from "react-router-dom";

import RouteShell from "./RouteShell";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminPumps from "../pages/admin/AdminPumps";
import AdminPumpDetails from "../pages/admin/AdminPumpDetails";
import OwnersManagement from "../pages/admin/OwnersManagement";
import AdminTransactions from "../pages/admin/AdminTransactions";
import AdminProfile from "../pages/admin/AdminProfile";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        element={
          <RouteShell
            allowedRoles={["admin"]}
            role="admin"
          />
        }
      >
        <Route
          index
          element={
            <Navigate
              to="dashboard"
              replace
            />
          }
        />

        <Route
          path="dashboard"
          element={<AdminDashboard />}
        />
        <Route
          path="pumps"
          element={<AdminPumps />}
        />

        <Route
          path="pumps/:pumpCode"
          element={<AdminPumpDetails />}
        />

        <Route
          path="owners"
          element={<OwnersManagement />}
        />

        <Route
          path="transactions"
          element={<AdminTransactions />}
        />

        <Route
          path="users"
          element={<AdminProfile />}
        />
      </Route>
    </Routes>
  );
}
