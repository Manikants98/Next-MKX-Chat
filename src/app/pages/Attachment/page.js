"use client";
import {
  Attachment,
  CameraAlt,
  ContactPage,
  Description,
  MoreVert,
  PhotoLibrary,
} from "@mui/icons-material";
import { Divider, IconButton, Menu, MenuItem } from "@mui/material";
import React from "react";

const Attachments = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <Attachment />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        PaperProps={{ className: "!bg-[#222E35] !bg-opacity-100" }}
        className="!mb-10 !-translate-y-4"
      >
        <MenuItem
          onClick={handleClose}
          className="hover:!bg-[#0c1317] !flex gap-2 !items-center"
        >
          <Description className="text-blue-400" /> Document
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          className="hover:!bg-[#0c1317] !flex gap-2 !items-center"
        >
          <PhotoLibrary color="primary" /> Photos & Videos
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          className="hover:!bg-[#0c1317] !flex gap-2 !items-center"
        >
          <CameraAlt className="text-pink-500" /> Camera
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          className="hover:!bg-[#0c1317] !flex gap-2 !items-center"
        >
          <ContactPage className="text-green-500" /> Contact
        </MenuItem>
      </Menu>
    </>
  );
};

export default Attachments;
