import axiosInstance from "@/app/utils/axiosInstance";

export const signInFn = async (reqbody) => {
  try {
    const response = await axiosInstance.post("api/auth/signin", reqbody);
    return response.data;
  } catch (error) {
    throw error;
  }
};
