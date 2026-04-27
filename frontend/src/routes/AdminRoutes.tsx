import { Routes, Route, Navigate } from "react-router-dom";

import RouteShell from "./RouteShell";

// import AdminDashboard from "../pages/admin/AdminDashboard";
// import AdminPumps from "../pages/admin/AdminPumps";
// import AdminPumpDetails from "../pages/admin/AdminPumpDetails";
// import AdminOwners from "../pages/admin/AdminOwners";
// import AdminTransactions from "../pages/admin/AdminTransactions";
// import AdminUsers from "../pages/admin/AdminUsers";

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

        {/* <Route
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
          element={<AdminOwners />}
        />

        <Route
          path="transactions"
          element={<AdminTransactions />}
        />

        <Route
          path="users"
          element={<AdminUsers />}
        /> */}
      </Route>
    </Routes>
  );
}
