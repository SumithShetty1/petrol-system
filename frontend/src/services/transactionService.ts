import api from "../api/api";

export const createTransaction = async (data: any) => {
  const response = await api.post(
    "transactions/create/",
    data
  );

  return response.data;
};


export const getTransactions = async (
  range: string,
  startDate?: string,
  endDate?: string,
  attendantPhone?: string,
  fuelType?: string
) => {
  let url = `/transactions/?range=${range}`;

  if (attendantPhone && attendantPhone !== "all") {
    url += `&attendant=${attendantPhone}`;
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


export const getOwnerTransactions = async (
  range: string,
  startDate?: string,
  endDate?: string,
  pumpId?: string,
  fuelType?: string
) => {
  let url = `/transactions/?range=${range}`;

  if (pumpId && pumpId !== "all") {
    url += `&pump=${pumpId}`;
  }

  if (
    fuelType &&
    fuelType !== "all"
  ) {
    url += `&fuel=${fuelType}`;
  }

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
