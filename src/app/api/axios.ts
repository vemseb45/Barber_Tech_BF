import axios from "axios";

/*
|--------------------------------------------------------------------------
| Axios instance
|--------------------------------------------------------------------------
*/

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
|--------------------------------------------------------------------------
| REQUEST INTERCEPTOR
| -> agrega JWT automáticamente
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/*
|--------------------------------------------------------------------------
| RESPONSE INTERCEPTOR
| -> intenta refresh automático si expira token
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== "undefined") {
        try {
          const refresh = localStorage.getItem("refresh_token");

          if (!refresh) {
            window.location.href = "/login";
            return Promise.reject(error);
          }

          const response = await axios.post(`${baseURL}token/refresh/`, {
            refresh,
          });

          const newAccess = response.data.access;

          localStorage.setItem("token", newAccess);
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;

          return api(originalRequest);
        } catch (err) {
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;