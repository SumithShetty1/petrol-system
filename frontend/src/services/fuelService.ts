import api from "../api/api";

export const getFuelRates = async () => {
  const res = await api.get("fuel-rates/");
  return res.data;
};

export const updateFuelRate = async (id: number, price: number) => {
  return await api.patch(`fuel-rates/${id}/`, {
    price_per_litre: price,
  });
};
