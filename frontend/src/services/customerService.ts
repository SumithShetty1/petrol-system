import api from "../api/api";


export const fetchCustomer = async (mobile: string) => {
  const res = await api.get(`customers/?mobile_number=${mobile}`);

  return res.data;
};

export const getCustomerTransactions = async (phone: string) => {
  const res = await api.get(
    `/transactions/?customer_mobile=${phone}&range=all`
  );

  return res.data;
};

export const getCustomerByMobile = async (phone:string) => {
  const res = await api.get(`/customers/?mobile_number=${phone}`);
  return res.data;
};
