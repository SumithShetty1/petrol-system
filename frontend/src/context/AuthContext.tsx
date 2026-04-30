import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";


// =====================================
// AUTH CONTEXT TYPE
// =====================================
type AuthContextType = {
  isAuthenticated: boolean;
  login: (access: string, refresh: string) => Promise<void>;
  logout: () => void;
};

// =====================================
// CONTEXT CREATION
// =====================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =====================================
// AUTH PROVIDER
// =====================================
export const AuthProvider = ({ children }: { children: ReactNode }) => {

  // -----------------------------------
  // INITIAL AUTH STATE
  // -----------------------------------
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access")
  );

  // -----------------------------------
  // LOGIN FUNCTION
  // -----------------------------------
  const login = async (access: string, refresh: string) => {

    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);

    setIsAuthenticated(true);
  };

  // -----------------------------------
  // LOGOUT FUNCTION
  // -----------------------------------
  const logout = () => {

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    setIsAuthenticated(false);
  };

  // -----------------------------------
  // PROVIDER VALUE
  // -----------------------------------
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );

};


// =====================================
// CUSTOM HOOK
// =====================================
export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;

};
