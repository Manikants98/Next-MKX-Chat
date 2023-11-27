import { AddAPhoto } from "@mui/icons-material";
import { Avatar, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useState } from "react";

export default function ImageUploader({ name = "", formik }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (event) => {
    try {
      setIsLoading(true);
      const reqbody = new FormData();
      reqbody.append("image", event.target.files?.[0]);
      const response = await axios.post(`/api/upload`, reqbody);
      const newBlob = await response.data;
      formik.setFieldValue(name, newBlob?.url);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <span className="flex flex-col items-center justify-center gap-1">
      <Avatar
        src={formik?.values?.[name]}
        component="label"
        className="!h-20 cursor-pointer !w-20"
      >
        {isLoading ? <CircularProgress /> : <AddAPhoto fontSize="large" />}
        <input type="file" hidden name="name" onChange={handleFileUpload} />
      </Avatar>
      {formik?.values?.[name] && (
        <Button size="small" component="label" className="!text-xs !capitalize">
          Change Picture
          <input type="file" hidden onChange={handleFileUpload} />
        </Button>
      )}
    </span>
  );
}
