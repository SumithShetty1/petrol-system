import api from "../api/api";


// -----------------------------------
// GET EMPLOYEE PROFILE
// -----------------------------------
export const getProfile = async () => {
  const res = await api.get("employees/profile/");
  return res.data;
};

// -----------------------------------
// GET AUTH PROFILE
// -----------------------------------
export const getMyProfile = async () => {
  const res = await api.get("auth/me/");
  return res.data;
};
