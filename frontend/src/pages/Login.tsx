import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoginScreen from "../components/auth/LoginScreen";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

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
      login(data.access, data.refresh);
      navigate("/transaction");
    } catch (error) {
      alert("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = phone.length === 10 && password.length >= 4;

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
