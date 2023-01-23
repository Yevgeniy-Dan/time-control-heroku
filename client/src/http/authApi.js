import axios from "axios";

const authApi = axios.create({
  withCredentials: true,
  proxy: true,
});

export default authApi;

authApi.interceptors.request.use((config) => {
  config.headers["Content-Type"] = "application/x-www-form-urlencoded";

  return config;
});
