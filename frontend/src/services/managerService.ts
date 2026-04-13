import api from "../api/api";

export const getAttendants = async () => {
  const res = await api.get("/employees/");
  return res.data;
};

export const getTransactions = async (
  range: string,
  startDate?: string,
  endDate?: string,
  attendantId?: string,
  fuelType?: string
) => {
  let url = `/transactions/?range=${range}`;

  if (attendantId && attendantId !== "all") {
    url += `&attendant=${attendantId}`;
  }

  if (fuelType && fuelType !== "all") {
    url += `&fuel=${fuelType}`;
  }

  if (range === "custom" && startDate && endDate) {
    url += `&start_date=${startDate}&end_date=${endDate}`;
  }

  const res = await api.get(url);
  return res.data;
};

export const searchCustomer = async (phone:string) => {
  const res = await api.get(`/customers/?mobile_number=${phone}`);
  return res.data;
};
