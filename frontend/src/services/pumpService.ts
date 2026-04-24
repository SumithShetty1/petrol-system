import api from "../api/api";

export const getPumps = async () => {
  const res = await api.get("pumps/");
  return res.data;
};
