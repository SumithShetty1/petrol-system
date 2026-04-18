import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import type { JSX } from "react/jsx-dev-runtime";

type Props = {
  children: JSX.Element;
  allowedRoles?: string[];
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { isAuthenticated } = useAuth();

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const token = localStorage.getItem("access");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded: any = jwtDecode(token);
    const userRole = decoded.role;

    // Role restriction
    if (allowedRoles && !allowedRoles.includes(userRole)) {

      // Smart redirect based on role
      if (userRole === "attendant") {
        return <Navigate to="/attendant/transaction" replace />;
      } else {
        return <Navigate to="/manager/dashboard" replace />;
      }
    }

    return children;

  } catch (error) {
    // Invalid token
    return <Navigate to="/" replace />;
  }
}