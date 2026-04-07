import api from "../api/api";

export const loginUser = async (
  username: string,
  password: string
) => {
  const response = await api.post("auth/login/", {
    username: username,
    password: password,
  });

  return response.data;
};