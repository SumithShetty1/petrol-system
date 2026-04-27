import api from "../api/api";

// -----------------------------------
// LOGIN
// -----------------------------------
export const loginUser = async (
  username: string,
  password: string
) => {
  const res = await api.post(
    "/auth/login/",
    { username, password }
  );

  return res.data;
};

// -----------------------------------
// CREATE USERS
// -----------------------------------
export const createAttendant = async (data: {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  is_active: boolean;
}) => {
  const res = await api.post(
    "/auth/register/",
    {
      ...data,
      role: "attendant",
    }
  );

  return res.data;
};

export const createManager = async (data: {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  is_active: boolean;
  pump_id: number;
}) => {
  const res = await api.post(
    "/auth/register/",
    {
      ...data,
      role: "manager",
    }
  );

  return res.data;
};

// -----------------------------------
// UPDATE USER
// -----------------------------------
export const updateUser = async (
  id: number,
  data: {
    first_name: string;
    last_name: string;
    username: string;
    password?: string;
    is_active: boolean;
  }
) => {
  const res = await api.patch(
    `/auth/users/${id}/`,
    data
  );

  return res.data;
};

// -----------------------------------
// DELETE USER
// -----------------------------------
export const deleteUser = async (
  id: number
) => {
  const res = await api.delete(
    `/auth/users/${id}/`
  );

  return res.data;
};
