import api from "../api/api";


export const getDashboard = async (
  pumpId: number,
  range: string,
  startDate?: string,
  endDate?: string
) => {

  let url = `/reports/dashboard/${pumpId}/?range=${range}`;

  if (range === "custom" && startDate && endDate) {
    url += `&start_date=${startDate}&end_date=${endDate}`;
  }

  const res = await api.get(url);
  return res.data;
};


export const getAttendantDashboard = async (
  range: string,
  startDate?: string,
  endDate?: string
) => {
  let url = `reports/attendant-dashboard/?range=${range}`;

  if (range === "custom" && startDate && endDate) {
    url += `&start_date=${startDate}&end_date=${endDate}`;
  }

  const res = await api.get(url);
  return res.data;
};
