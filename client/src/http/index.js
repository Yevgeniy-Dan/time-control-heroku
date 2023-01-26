import axios from "axios";

import authApi from "./authApi";
import store from "../store";
import { API_URL } from "../store/auth/auth-service";
import { authActions } from "../store/auth/auth-slice";

const api = axios.create({
  withCredentials: true,
  proxy: true,
});

const { dispatch, getState } = store;

api.interceptors.request.use((config) => {
  config.headers["Content-Type"] = "application/x-www-form-urlencoded";
  config.headers["Authorization"] = `Bearer ${getState().auth.user.token}`;

  return config;
});

api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        const response = await authApi.get(API_URL + "refresh");

        localStorage.setItem("user", JSON.stringify(response.data));
        dispatch(
          authActions.refresh({
            user: response.data,
          })
        );

        return api.request(originalRequest);
      } catch (error) {
        console.log(error);
        localStorage.removeItem("user");
        dispatch(
          authActions.refresh({
            user: null,
            isError: true,
            message:
              (error.response &&
                error.response?.data &&
                error.response?.data?.message) ||
              error.message ||
              error.toString(),
          })
        );

        dispatch(authActions.reset());
      }
    }
    throw error;
  }
);

export default api;
