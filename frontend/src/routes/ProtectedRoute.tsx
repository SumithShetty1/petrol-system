// src/routes/ProtectedRoute.tsx

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import type { JSX } from "react/jsx-dev-runtime";

type Props = {
  children: JSX.Element;
  allowedRoles?: string[];
};

export default function ProtectedRoute({
  children,
  allowedRoles,
}: Props) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const token = localStorage.getItem("access");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded: any = jwtDecode(token);
    const role = decoded.role;

    if (allowedRoles && !allowedRoles.includes(role)) {
      if (role === "attendant") {
        return <Navigate to="/attendant/transaction" replace />;
      }

      if (role === "manager") {
        return <Navigate to="/manager/dashboard" replace />;
      }

      if (role === "owner") {
        return <Navigate to="/owner/dashboard" replace />;
      }

      if (role === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
      }

      return <Navigate to="/" replace />;
    }

    return children;
  } catch {
    return <Navigate to="/" replace />;
  }
}
