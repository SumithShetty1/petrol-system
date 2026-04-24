import api from "../api/api";

export const loginUser = async (
  username: string,
  password: string
) => {
  const response = await api.post("auth/login/", {
    username: username,
    password: password,
  });

  return response.data;
};

export const createAttendant = async (data: {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  is_active: boolean;
}) => {
  const res = await api.post("/auth/register/", {
    ...data,
    role: "attendant",
  });

  return res.data;
};

export const updateAttendant = async (
  id: number,
  data: {
    first_name: string;
    last_name: string;
    username: string;
    password?: string;
    is_active: boolean;
  }
) => {
  const res = await api.patch(`/auth/users/${id}/`, data);
  return res.data;
};

export const deleteAttendant = async (id: number) => {
  const res = await api.delete(`/auth/users/${id}/`);
  return res.data;
};
