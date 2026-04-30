import api from "../api/api";


// -----------------------------------
// GET ALL PUMPS
// -----------------------------------
export const getPumps = async () => {
  const res = await api.get("pumps/");
  return res.data;
};

// -----------------------------------
// GET PUMP BY CODE
// -----------------------------------
export const getPumpByCode = async (
  pumpCode: string
) => {
  const res = await api.get(
    `pumps/${pumpCode}/`
  );

  return res.data;
};

// -----------------------------------
// GET MANAGER ASSIGNED PUMP
// -----------------------------------
export const getMyPump = async () => {
  const res = await api.get("pumps/assigned/");
  return res.data;
};

// -----------------------------------
// GET AVAILABLE PUMPS
// -----------------------------------
export const getAvailablePumps = async () => {
  const res = await api.get("pumps/available/");
  return res.data;
};

// -----------------------------------
// CREATE PUMP
// -----------------------------------
export const createPump = (data: any) =>
  api.post("/pumps/", data);

// -----------------------------------
// UPDATE PUMP
// -----------------------------------
export const updatePump = (code: string, data: any) =>
  api.patch(`/pumps/${code}/`, data);

// -----------------------------------
// DELETE PUMP
// -----------------------------------
export const deletePump = (code: string) =>
  api.delete(`/pumps/${code}/`);
