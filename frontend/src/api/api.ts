import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {

  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;

});

// RESPONSE INTERCEPTOR (REFRESH TOKEN LOGIC)

api.interceptors.response.use(
  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        return Promise.reject(error);
      }

      try {

        const res = await axios.post(
          "http://127.0.0.1:8000/api/auth/refresh/",
          { refresh }
        );

        const newAccess = res.data.access;

        localStorage.setItem("access", newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return api(originalRequest);

      } catch (err) {

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        window.location.href = "/";

        return Promise.reject(err);

      }

    }

    return Promise.reject(error);

  }
);

export default api;
