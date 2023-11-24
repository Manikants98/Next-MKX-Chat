import axios from "axios";
import { enqueueSnackbar as Snackbar } from "notistack";

// const baseURL = "https://mkx-chat.vercel.app/";
const baseURL = "http://localhost:3000/";
const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    config.headers = {
      Authorization: token,
      ...config.headers,
    };
    return config;
  },
  (err) => Promise.reject(err)
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    Snackbar(error.response.data.message, { variant: "error" });
    return Promise.reject(error);
  }
);

export default axiosInstance;
