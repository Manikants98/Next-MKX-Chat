"use client";
import { MoreVert } from "@mui/icons-material";
import { Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

const Options = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const router = useRouter();
  return (
    <>
      <IconButton onClick={handleClick} className="">
        <MoreVert />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        className="!mt-3"
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        PaperProps={{ className: "!bg-[#222E35] !bg-opacity-100" }}
      >
        <MenuItem onClick={handleClose} className="hover:!bg-[#0c1317]">
          New Group
        </MenuItem>
        <MenuItem onClick={handleClose} className="hover:!bg-[#0c1317]">
          New Community
        </MenuItem>
        <MenuItem onClick={handleClose} className="hover:!bg-[#0c1317]">
          Starred Messages
        </MenuItem>
        <MenuItem onClick={handleClose} className="hover:!bg-[#0c1317]">
          Select Chat
        </MenuItem>
        <MenuItem onClick={handleClose} className="hover:!bg-[#0c1317]">
          Settings
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            localStorage.clear();
            router.push("/auth/signin");
          }}
          className="hover:!bg-[#0c1317]"
        >
          Logout
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose} className="hover:!bg-[#0c1317]">
          Get MKX Chat for Windows
        </MenuItem>
      </Menu>
    </>
  );
};

export default Options;
