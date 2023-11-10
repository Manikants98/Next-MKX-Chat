"use client";
import axiosInstance from "@/app/utils/axiosInstance";
import { Avatar, Button, Dialog, TextField } from "@mui/material";
import { enqueueSnackbar as Snackbar } from "notistack";
import { useState } from "react";
import { useQueryClient } from "react-query";

export default function SignUp({ fetchChats }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassord] = useState("");

  const createChatsFn = async (reqbody) =>
    axiosInstance
      .post("auth/signup", reqbody)
      .then((response) => {
        Snackbar(response.message, { variant: "success" });
        setOpen(false);

      })
      .catch((error) => {
        setOpen(false);
        error?.response?.data?.message &&
          Snackbar(error?.response?.data?.message, { variant: "error" });
      });

  const handleSubmit = async (e) => {
    e.preventDefault();
    createChatsFn({
      name: name,
      email: email,
      password: password,
    });
  };

  return (
    <>
      <Avatar onClick={() => setOpen(true)}>M</Avatar>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ className: "lg:!max-w-[1/4]" }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5">
          <p className="text-lg font-semibold text-center">SignUp</p>
          <TextField
            size="small"
            type="text"
            label="Name"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Email"
            size="small"
            type="text"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Pasword"
            size="small"
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassord(e.target.value)}
          />
          <Button
            type="submit"
            className="!bg-black !text-white"
            size="small"
            variant="contained"
          >
            Submit
          </Button>
        </form>
      </Dialog>
    </>
  );
}
