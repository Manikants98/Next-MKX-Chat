import axiosInstance from "@/app/utils/axiosInstance";
import { enqueueSnackbar as Snackbar } from "notistack";

export const getContactsFn = (reqbody) => {
  try {
    const res = axiosInstance.get("/api/contacts", { params: reqbody });
    return res.data;
  } catch (error) {
    Snackbar(error.response.data.message, { variant: "error" });
  }
};
export const addContactsFn = (reqbody) => {
  try {
    const res = axiosInstance.post("/api/contacts", reqbody);
    return res.data;
  } catch (error) {
    Snackbar(error.response.data.message, { variant: "error" });
  }
};

export const updateContactsFn = (reqbody) => {
  try {
    const res = axiosInstance.put("/api/contacts", reqbody);
    return res.data;
  } catch (error) {
    Snackbar(error.response.data.message, { variant: "error" });
  }
};
export const deleteContactsFn = (reqbody) => {
  try {
    const res = axiosInstance.delete("/api/contacts", { data: reqbody });
    return res.data;
  } catch (error) {
    Snackbar(error.response.data.message, { variant: "error" });
  }
};
