import api from "../api/api";

export const getAttendants = async () => {
  const res = await api.get("/employees/attendants/");
  return res.data;
};

export const getManagers = async () => {
  const res = await api.get("/employees/managers/");
  return res.data;
};

export const getEmployeeById = async (id:number) => {
  const res = await api.get(`employees/${id}/`);
  return res.data;
};
