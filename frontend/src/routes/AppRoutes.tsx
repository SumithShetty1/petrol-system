import { Routes, Route } from "react-router-dom";

import Login from "../pages/login/Login";import AttendantRoutes from "./AttendantRoutes";
import ManagerRoutes from "./ManagerRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/attendant/*" element={<AttendantRoutes />} />
      <Route path="/manager/*" element={<ManagerRoutes />} />
    </Routes>
  );
}
