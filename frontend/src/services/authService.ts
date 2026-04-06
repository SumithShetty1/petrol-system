import api from "../api/api";

export const loginUser = async (phone: string, password: string) => {
  const response = await api.post("auth/login/", {
    username: phone,
    password: password,
  });

  return response.data;
};
