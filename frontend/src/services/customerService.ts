import api from "../api/api";


// -----------------------------------
// GET CUSTOMER BY MOBILE
// -----------------------------------
export const getCustomerByMobile = async (phone:string) => {
  const res = await api.get(`/customers/?mobile_number=${phone}`);
  return res.data;
};
