import api from "../api/api";

export const getProfile = async () => {
  const res = await api.get("employees/profile/");
  return res.data;
};
