import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import LoginScreen from "../../components/login/LoginScreen";
import { loginUser } from "../../services/authService";

import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const getRedirectByRole = (role: string) => {
    switch (role) {
      case "attendant":
        return "/attendant/transaction";
      case "manager":
        return "/manager/dashboard";
      case "owner":
        return "/owner/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError(""); 

    try {
      const data = await loginUser(phone, password);

      login(data.access, data.refresh);

      const decoded: any = jwtDecode(data.access);

      navigate(getRedirectByRole(decoded.role));
    } catch (err: any) {
      console.error(err);

      let message = "Something went wrong. Please try again.";

      // NETWORK ERROR (Backend down / no internet)
      if (!err.response) {
        message = "Unable to connect to server. Please check your internet or try again later.";
      }

      // TIMEOUT ERROR
      else if (err.code === "ECONNABORTED") {
        message = "Request timed out. Server is taking too long to respond.";
      }

      // AUTH ERROR (WRONG CREDENTIALS)
      else if (err.response.status === 401) {
        message = "Invalid phone number or password.";
      }

      // OTHER SERVER ERRORS
      else {
        message =
          err.response?.data?.detail ||
          err.response?.data?.error ||
          "Login failed. Please try again.";
      }

      setError(message);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginScreen
      phone={phone}
      password={password}
      onPhoneChange={(val) => {
        setPhone(val);
        setError(""); 
      }}
      onPasswordChange={(val) => {
        setPassword(val);
        setError(""); 
      }}
      onSubmit={handleLogin}
      isValid={phone.length === 10}
      isLoading={isLoading}
      error={error} 
    />
  );
}
