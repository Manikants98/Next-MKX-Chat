import axiosInstance from "@/app/utils/axiosInstance";

export const fetchContacts = async () => {
  try {
    const response = await axiosInstance.get("/contacts");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createContact = async (reqbody) => {
  try {
    const response = await axiosInstance.post("/contacts", reqbody);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateContact = async (reqbody) => {
  try {
    const response = await axiosInstance.put(`/contacts`, reqbody);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteContact = async (reqbody) => {
  try {
    const response = await axiosInstance.delete(`/contacts`, { data: reqbody });
    return response.data;
  } catch (error) {
    throw error;
  }
};
