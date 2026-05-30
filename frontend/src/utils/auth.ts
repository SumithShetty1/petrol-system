import { jwtDecode } from "jwt-decode";

export const getCurrentUserRole = (): string => {
  const token = localStorage.getItem("access");

  if (!token) {
    return "";
  }

  try {
    const decoded: any = jwtDecode(token);

    return decoded.role || "";
  } catch {
    return "";
  }
};
