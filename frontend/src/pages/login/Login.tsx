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

    try {
      const data = await loginUser(phone, password);

      login(data.access, data.refresh);

      const decoded: any = jwtDecode(data.access);

      navigate(getRedirectByRole(decoded.role));
    } catch {
      alert("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginScreen
      phone={phone}
      password={password}
      onPhoneChange={setPhone}
      onPasswordChange={setPassword}
      onSubmit={handleLogin}
      isValid={phone.length === 10}
      isLoading={isLoading}
    />
  );
}
