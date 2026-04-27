import api from "../api/api";

export const getPumps = async () => {
  const res = await api.get("pumps/");
  return res.data;
};

export const getPumpByCode = async (
  pumpCode: string
) => {
  const res = await api.get(
    `pumps/${pumpCode}/`
  );

  return res.data;
};

export const getMyPump = async () => {
  const res = await api.get("pumps/assigned/");
  return res.data;
};

export const getAvailablePumps = async () => {
  const res = await api.get("pumps/available/");
  return res.data;
};
