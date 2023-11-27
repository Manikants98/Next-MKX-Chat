import axiosInstance from "@/app/utils/axiosInstance";
import { enqueueSnackbar as Snackbar } from "notistack";

export const getContactsFn = async (reqbody) => {
  try {
    const res = await axiosInstance.get("/api/contacts", { params: reqbody });
    return res;
  } catch (error) {
    Snackbar(error.response.data.message, { variant: "error" });
  }
};
export const addContactsFn = async (reqbody) => {
  try {
    const res = await axiosInstance.post("/api/contacts", reqbody);
    return res;
  } catch (error) {
    throw Error(error);
  }
};

export const updateContactsFn = async (reqbody) => {
  try {
    const res = await axiosInstance.put("/api/contacts", reqbody);
    return res;
  } catch (error) {
    Snackbar(error.response.data.message, { variant: "error" });
  }
};
export const deleteContactsFn = async (reqbody) => {
  try {
    const res = await axiosInstance.delete("/api/contacts", { data: reqbody });
    return res;
  } catch (error) {
    Snackbar(error.response.data.message, { variant: "error" });
  }
};
