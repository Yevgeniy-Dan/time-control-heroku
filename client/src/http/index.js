import axios from "axios";

const api = axios.create({
  proxy: true,
});

api.interceptors.request.use((config) => {
  config.headers["Content-Type"] = "application/x-www-form-urlencoded";

  return config;
});

export default api;
