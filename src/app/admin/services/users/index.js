import axiosInstance from "@/app/utils/axiosInstance";
import axios from "axios";
import { enqueueSnackbar as Snackbar } from "notistack";

export const getUsersFn = async (reqbody) => {
  try {
    const res = await axios.get("/api/users", { params: reqbody });
    return res;
  } catch (error) {
    Snackbar(error.response.data.message, { variant: "error" });
  }
};
export const addUsersFn = async (reqbody) => {
  try {
    const res = await axiosInstance.post("/api/users", reqbody);
    return res;
  } catch (error) {
    Snackbar(error.response.data.message, { variant: "error" });
  }
};

export const updateUsersFn = async (reqbody) => {
  try {
    const res = await axiosInstance.put("/api/users", reqbody);
    return res;
  } catch (error) {
    Snackbar(error.response.data.message, { variant: "error" });
  }
};
export const deleteUsersFn = async (reqbody) => {
  try {
    const res = await axiosInstance.delete("/api/users", { data: reqbody });
    return res;
  } catch (error) {
    Snackbar(error.response.data.message, { variant: "error" });
  }
};
