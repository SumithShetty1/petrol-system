import api from "../api/api";

export const getFuelRates = async () => {
  const res = await api.get(`fuel-rates/`);
  return res.data;
};
