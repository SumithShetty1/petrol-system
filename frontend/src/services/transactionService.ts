import api from "../api/api";


// -----------------------------------
// CREATE TRANSACTION
// -----------------------------------
export const createTransaction = async (data: any) => {
  const response = await api.post(
    "transactions/create/",
    data
  );

  return response.data;
};

// -----------------------------------
// GET CUSTOMER TRANSACTIONS
// -----------------------------------
export const getCustomerTransactions = async (
  phone: string,
  page: number = 1,
  pageSize: number = 20
) => {
  const res = await api.get(
    `/transactions/?customer_mobile=${phone}&range=all&page=${page}&page_size=${pageSize}`
  );

  return {
    data: res.data.results,
    total: res.data.count,
    next: res.data.next,
    previous: res.data.previous,
    hasNext: !!res.data.next,
  };
};

// -----------------------------------
// GET TRANSACTIONS (MANAGER / ADMIN)
// -----------------------------------
export const getTransactions = async (
  range: string,
  page: number = 1,
  pageSize: number = 20,
  startDate?: string,
  endDate?: string,
  attendantPhone?: string,
  fuelType?: string,
  pumpId?: string
) => {
  let url = `/transactions/?range=${range}&page=${page}&page_size=${pageSize}`;

  if (pumpId && pumpId !== "all") {
    url += `&pump=${pumpId}`;
  }

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

  return {
    data: res.data.results,
    total: res.data.count,
    next: res.data.next,
    previous: res.data.previous,
    hasNext: !!res.data.next
  };
};

// -----------------------------------
// GET OWNER TRANSACTIONS
// -----------------------------------
export const getOwnerTransactions = async (
  range: string,
  page: number = 1,
  pageSize: number = 20,
  startDate?: string,
  endDate?: string,
  pumpId?: string,
  fuelType?: string
) => {
  let url = `/transactions/?range=${range}&page=${page}&page_size=${pageSize}`;

  if (pumpId && pumpId !== "all") {
    url += `&pump=${pumpId}`;
  }

  if (fuelType && fuelType !== "all") {
    url += `&fuel=${fuelType}`;
  }

  if (range === "custom" && startDate && endDate) {
    url += `&start_date=${startDate}&end_date=${endDate}`;
  }

  const res = await api.get(url);

  return {
    data: res.data.results,
    total: res.data.count,
    next: res.data.next,
    previous: res.data.previous
  };
};

// -----------------------------------
// EXPORT TRANSACTIONS
// -----------------------------------
export const exportTransactions = async (
  range: string,
  startDate?: string,
  endDate?: string,
  attendantPhone?: string,
  fuelType?: string,
  pumpId?: string
) => {
  let url = `/transactions/export/?range=${range}`;

  if (pumpId && pumpId !== "all") {
    url += `&pump=${pumpId}`;
  }

  if (attendantPhone && attendantPhone !== "all") {
    url += `&attendant=${attendantPhone}`;
  }

  if (fuelType && fuelType !== "all") {
    url += `&fuel=${fuelType}`;
  }

  if (range === "custom" && startDate && endDate) {
    url += `&start_date=${startDate}&end_date=${endDate}`;
  }

  const res = await api.get(url, {
    responseType: "blob",
  });

  return res.data;
};
