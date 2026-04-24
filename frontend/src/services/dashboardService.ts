import api from "../api/api";


export const getOwnerDashboard = async (
  range: string,
  startDate?: string,
  endDate?: string
) => {
  let url = `/reports/owner/?range=${range}`;

  if (range === "custom" && startDate && endDate) {
    url += `&start_date=${startDate}&end_date=${endDate}`;
  }

  const res = await api.get(url);
  return res.data;
};


export const getDashboard = async (
  range: string,
  startDate?: string,
  endDate?: string
) => {
  let url = `/reports/pump/?range=${range}`;

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
  let url = `reports/attendant/me/?range=${range}`;

  if (range === "custom" && startDate && endDate) {
    url += `&start_date=${startDate}&end_date=${endDate}`;
  }

  const res = await api.get(url);
  return res.data;
};


export const getAttendantDashboardById = async (
  attendantId: number,
  range: string,
  startDate?: string,
  endDate?: string
) => {
  let url = `/reports/attendant/${attendantId}/?range=${range}`;

  if (range === "custom" && startDate && endDate) {
    url += `&start_date=${startDate}&end_date=${endDate}`;
  }

  const res = await api.get(url);
  return res.data;
};
