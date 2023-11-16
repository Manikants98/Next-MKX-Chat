import axiosInstance from "@/app/utils/axiosInstance";
import { enqueueSnackbar as Snackbar } from "notistack";

export const getChatsFn = (reqbody) => {
  try {
    const res = axiosInstance.get("/api/chats", { params: reqbody });
    return res.data;
  } catch (error) {
    Snackbar(error.response.data.message, { variant: "error" });
  }
};
export const addChatsFn = (reqbody) => {
  try {
    const res = axiosInstance.post("/api/chats", reqbody);
    return res.data;
  } catch (error) {
    Snackbar(error.response.data.message, { variant: "error" });
  }
};

export const updateChatsFn = (reqbody) => {
  try {
    const res = axiosInstance.put("/api/chats", reqbody);
    return res.data;
  } catch (error) {
    Snackbar(error.response.data.message, { variant: "error" });
  }
};
export const deleteChatsFn = (reqbody) => {
  try {
    const res = axiosInstance.delete("/api/chats", { data: reqbody });
    return res.data;
  } catch (error) {
    Snackbar(error.response.data.message, { variant: "error" });
  }
};
