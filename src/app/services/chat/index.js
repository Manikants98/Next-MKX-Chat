import axiosInstance from "@/app/utils/axiosInstance";

export const getChatsFn = async () => {
  try {
    const response = await axiosInstance.get("api/chats");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getUserFn = async () => {
  try {
    const response = await axiosInstance.get("api/users");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getContactsFn = async () => {
  try {
    const response = await axiosInstance.get("api/contacts");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getMessagesFn = async (requestBody) => {
  try {
    const response = await axiosInstance.get("api/messages", {
      params: requestBody,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const sendMessagesFn = async (requestBody) => {
  try {
    const response = await axiosInstance.post("api/messages", requestBody);
    return response.data;
  } catch (error) {
    throw error;
  }
};
