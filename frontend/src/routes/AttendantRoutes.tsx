import { Routes, Route, Navigate } from "react-router-dom";

import RouteShell from "./RouteShell";

import Transaction from "../pages/attendant/Transaction";
import Profile from "../pages/attendant/Profile";

export default function AttendantRoutes() {
  return (
    <Routes>
      <Route
        element={
          <RouteShell
            allowedRoles={["attendant"]}
            role="attendant"
          />
        }
      >
        <Route index element={<Navigate to="transaction" replace />} />
        <Route path="transaction" element={<Transaction />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
