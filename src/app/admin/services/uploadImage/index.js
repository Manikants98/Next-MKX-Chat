import axiosInstance from "@/app/utils/axiosInstance";
import { enqueueSnackbar as Snackbar } from "notistack";

export const uploadImageFn = async (reqbody) => {
  try {
    const res = await axiosInstance.post("api/upload", reqbody);
    return res;
  } catch (error) {
    Snackbar(error.response.data.message, { variant: "error" });
  }
};
