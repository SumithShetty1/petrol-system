import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoginScreen from "../components/login/LoginScreen";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const data = await loginUser(phone, password);

      // Save tokens
      login(data.access, data.refresh);

      // Decode token
      const decoded: any = jwtDecode(data.access);

      const role = decoded.role;

      // Role-based navigation
      if (role === "attendant") {
        navigate("/attendant/transaction");
      } else if (role === "manager") {
        navigate("/manager/dashboard");
      } else if (role === "owner" || role === "admin") {
        navigate("/manager/dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {
      alert("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = phone.length === 10;

  return (
    <LoginScreen
      phone={phone}
      password={password}
      onPhoneChange={setPhone}
      onPasswordChange={setPassword}
      onSubmit={handleLogin}
      isValid={isValid}
      isLoading={isLoading}
    />
  );
}
