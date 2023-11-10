import axiosInstance from "@/app/utils/axiosInstance";

export const fetchChats = async () => {
  try {
    const response = await axiosInstance.get("auth/signup");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const createChatsFn = async (reqbody) => {
  try {
    const response = await axiosInstance.post("auth/signup", reqbody);
    return response.data;
  } catch (error) {
    throw error;
  }
};
