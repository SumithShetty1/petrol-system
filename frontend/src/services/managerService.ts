import api from "../api/api";

export const getDashboard = async (pumpId: number) => {
  const res = await api.get(`/reports/dashboard/${pumpId}/`);
  return res.data;
};

export const getAttendants = async () => {
  const res = await api.get("/employees/");
  return res.data;
};

export const getTransactions = async (pumpId:number) => {
  const res = await api.get(`/transactions/?pump=${pumpId}`);
  return res.data;
};

export const searchCustomer = async (phone:string) => {
  const res = await api.get(`/customers/?mobile_number=${phone}`);
  return res.data;
};
