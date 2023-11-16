import axiosInstance from "@/app/utils/axiosInstance";
import { enqueueSnackbar as Snackbar } from "notistack";

export const getGroupsFn = (reqbody) => {
  try {
    const res = axiosInstance.get("/api/groups", { params: reqbody });
    return res.data;
  } catch (error) {
    Snackbar(error.response.data.message, { variant: "error" });
  }
};
export const addGroupsFn = (reqbody) => {
  try {
    const res = axiosInstance.post("/api/groups", reqbody);
    return res.data;
  } catch (error) {
    Snackbar(error.response.data.message, { variant: "error" });
  }
};

export const updateGroupsFn = (reqbody) => {
  try {
    const res = axiosInstance.put("/api/groups", reqbody);
    return res.data;
  } catch (error) {
    Snackbar(error.response.data.message, { variant: "error" });
  }
};
export const deleteGroupsFn = (reqbody) => {
  try {
    const res = axiosInstance.delete("/api/groups", { data: reqbody });
    return res.data;
  } catch (error) {
    Snackbar(error.response.data.message, { variant: "error" });
  }
};
