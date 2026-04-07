import api from "../api/api";

export const fetchCustomer = async (mobile: string) => {
  const res = await api.get(`customers/?mobile_number=${mobile}`);

  return res.data;
};
