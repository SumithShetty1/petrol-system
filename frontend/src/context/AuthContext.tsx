import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { getProfile } from "../services/profileService";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (access: string, refresh: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access")
  );

  const login = async (access: string, refresh: string) => {

    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);

    try {

      const profile = await getProfile();

      localStorage.setItem("pump_id", profile.pump_id);

    } catch {

      console.log("Could not fetch profile");

    }

    setIsAuthenticated(true);
  };

  const logout = () => {

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("pump_id");

    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;

};
