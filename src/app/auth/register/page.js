"use client";
import handler from "@/app/api/db/createuser";
import { Button, TextField } from "@mui/material";
import React, { useState } from "react";

export default function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-5">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 p-10 border shadow"
      >
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
        <Button type="submit" size="small" variant="contained">
          Submit
        </Button>
      </form>
    </div>
  );
}
