import api from "../api/api";

export const getFuelRates = async (pumpId: number) => {

  const res = await api.get(`fuel-rates/?pump=${pumpId}`);

  return res.data;
};
