import {
  Divider,
  List,
  IconButton,
  ListItem,
  ListItemButton,
  Avatar,
} from "@mui/material";
import { FilterList, MoreVert, Groups } from "@mui/icons-material";
import Image from "next/image";
import React from "react";

const Chat = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0c1317] flex lg:p-5">
      <div className="flex lg:flex-row flex-col shadow w-full bg-gray-100 dark:bg-[#222e35]">
        <List className="flex flex-col lg:!w-1/3 !w-full border dark:border-[#202C33] !py-0 dark:text-white dark:bg-[#111B21]">
          <ListItem className="!flex !justify-between dark:bg-[#222e35]">
            <span className="!flex items-center !gap-2">
              
              <Avatar src="Mdsf" alt="M" /> <p> MKX Chat</p>
            </span>
            <span className="!flex items-center !gap-2">
              <IconButton>
                <Groups className="dark:text-gray-400" />
              </IconButton>
              <IconButton>
                <MoreVert className="dark:text-gray-400" />
              </IconButton>
            </span>
          </ListItem>
          <Divider />
          <ListItem className="!p-2 !flex !items-center !gap-1">
            <input
              className="p-2 dark:bg-[#0c1317] outline-none px-3 rounded-lg w-full"
              placeholder="Search or start new chat"
            />
            <IconButton>
              <FilterList className="dark:text-gray-400" />
            </IconButton>
          </ListItem>
          <Divider />

          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => {
            return (
              <>
                <ListItemButton className="flex justify-between py-3 px-4">
                  <p>Mani Kant Sharma</p>
                  <p className="text-xs">{new Date().toDateString()}</p>
                </ListItemButton>
                <Divider />
              </>
            );
          })}
        </List>

        <div className="flex lg:w-2/3 w-full border-y justify-center item-center dark:border-[#202C33] border-r">
          <Image
            src="/Chat-amico.svg"
            alt="My Image"
            width={500}
            height={400}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
