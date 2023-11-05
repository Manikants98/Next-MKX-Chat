"use client";
import { Avatar, Button, Dialog, Paper, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";

export default function SignUp() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassord] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/api/auth/signup", {
        username: name,
        email: email,
        password: password,
      })
      .then((res) => {
        alert(res.data.message);
        setOpen(false);
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }
      })
      .catch((res) => {
        console.error(res);
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
