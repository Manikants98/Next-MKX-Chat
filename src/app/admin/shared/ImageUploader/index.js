"use client";
import { AddAPhoto } from "@mui/icons-material";
import { Avatar, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useState } from "react";
export default function ImageUploader({ image, setImage }) {
  const [blob, setBlob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <span className="flex flex-col items-center justify-center">
      <Avatar
        src={image || ""}
        component="label"
        className="!h-20 cursor-pointer !w-20"
      >
        {isLoading ? <CircularProgress /> : <AddAPhoto fontSize="large" />}
        <input
          type="file"
          hidden
          onChange={async (event) => {
            try {
              setIsLoading(true);
              const reqbody = new FormData();
              reqbody.append("image", event.target.files?.[0]);
              const response = await axios.post(`/api/upload`, reqbody);
              const newBlob = await response.data;
              setBlob(newBlob);
              setImage(newBlob?.url);
              setIsLoading(false);
            } catch (error) {}
          }}
        />
      </Avatar>
      {blob && (
        <Button size="small" component="label" className="!text-xs !capitalize">
          Change Picture
          <input
            type="file"
            hidden
            onChange={async (event) => {
              setIsLoading(true);
              const reqbody = new FormData();
              reqbody.append("image", event.target.files?.[0]);
              const response = await axios.post(`/api/avatar/upload`, reqbody);
              const newBlob = await response.data;
              setBlob(newBlob);
              setIsLoading(false);
            }}
          />
        </Button>
      )}
    </span>
  );
}
