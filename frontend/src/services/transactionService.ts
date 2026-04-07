import api from "../api/api";

export const createTransaction = async (data: any) => {
  const response = await api.post(
    "transactions/create/",
    data
  );

  return response.data;
};
