import api from "../api/api";

export const getAttendantDashboard = async (range: string) => {

  const res = await api.get(
    `reports/attendant-dashboard/?range=${range}`
  );

  return res.data;
};
