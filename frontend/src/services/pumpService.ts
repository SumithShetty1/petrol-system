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

export const createPump = (data: any) =>
  api.post("/pumps/", data);

export const updatePump = (code: string, data: any) =>
  api.patch(`/pumps/${code}/`, data);

export const deletePump = (code: string) =>
  api.delete(`/pumps/${code}/`);
