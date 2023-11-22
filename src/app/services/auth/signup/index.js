import axiosInstance from "@/app/utils/axiosInstance";

export const signUpFn = async (reqbody) => {
  try {
    const response = await axiosInstance.post("api/auth/signup", reqbody);
    return response.data;
  } catch (error) {
    throw error;
  }
};
