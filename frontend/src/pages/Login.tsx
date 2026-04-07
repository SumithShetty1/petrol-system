import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoginScreen from "../components/auth/LoginScreen";

import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const data = await loginUser(phone, password);

      login(data.access, data.refresh);

      navigate("/transaction");
    } catch (error) {
      alert("Invalid username or password");
    }
  };

  return (
    <LoginScreen
      phone={phone}
      password={password}
      setPhone={setPhone}
      setPassword={setPassword}
      onLogin={handleLogin}
    />
  );
}
