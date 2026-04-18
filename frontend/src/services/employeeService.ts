import api from "../api/api";

export const getAttendants = async () => {
  const res = await api.get("/employees/attendants/");
  return res.data;
};
