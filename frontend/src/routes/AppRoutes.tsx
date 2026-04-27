import { Routes, Route } from "react-router-dom";

import Login from "../pages/login/Login";
import AttendantRoutes from "./AttendantRoutes";
import ManagerRoutes from "./ManagerRoutes";
import OwnerRoutes from "./OwnerRoutes";
import AdminRoutes from "./AdminRoutes";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/attendant/*" element={<AttendantRoutes />} />
      <Route path="/manager/*" element={<ManagerRoutes />} />
      <Route path="/owner/*" element={<OwnerRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
}
