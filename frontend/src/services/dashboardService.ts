import api from "../api/api";


// -----------------------------------
// OWNER DASHBOARD
// -----------------------------------
export const getOwnerDashboard = async (
  range: string,
  startDate?: string,
  endDate?: string
) => {
  let url = `/reports/owner/?range=${range}`;

  if (
    range === "custom" &&
    startDate &&
    endDate
  ) {
    url += `&start_date=${startDate}&end_date=${endDate}`;
  }

  const res = await api.get(url);
  return res.data;
};


// -----------------------------------
// OWNER SINGLE PUMP DASHBOARD
// -----------------------------------
export const getOwnerPumpDashboard = async (
  pumpCode: string,
  range: string,
  startDate?: string,
  endDate?: string
) => {
  let url = `/reports/owner/pumps/${pumpCode}/?range=${range}`;

  if (
    range === "custom" &&
    startDate &&
    endDate
  ) {
    url += `&start_date=${startDate}&end_date=${endDate}`;
  }

  const res = await api.get(url);
  return res.data;
};


// -----------------------------------
// MANAGER PUMP DASHBOARD
// -----------------------------------
export const getDashboard = async (
  range: string,
  startDate?: string,
  endDate?: string
) => {
  let url = `/reports/manager/pump/?range=${range}`;

  if (
    range === "custom" &&
    startDate &&
    endDate
  ) {
    url += `&start_date=${startDate}&end_date=${endDate}`;
  }

  const res = await api.get(url);
  return res.data;
};


// -----------------------------------
// ATTENDANT SELF DASHBOARD
// -----------------------------------
export const getAttendantDashboard = async (
  range: string,
  startDate?: string,
  endDate?: string
) => {
  let url = `/reports/attendant/me/?range=${range}`;

  if (
    range === "custom" &&
    startDate &&
    endDate
  ) {
    url += `&start_date=${startDate}&end_date=${endDate}`;
  }

  const res = await api.get(url);
  return res.data;
};


// -----------------------------------
// MANAGER VIEW ATTENDANT DASHBOARD
// -----------------------------------
export const getAttendantDashboardByPhone = async (
  phone: string,
  range: string,
  startDate?: string,
  endDate?: string
) => {
  let url = `/reports/manager/attendants/${phone}/?range=${range}`;

  if (
    range === "custom" &&
    startDate &&
    endDate
  ) {
    url += `&start_date=${startDate}&end_date=${endDate}`;
  }

  const res = await api.get(url);
  return res.data;
};
