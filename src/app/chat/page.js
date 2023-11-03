"use client";
import { FilterList, Groups } from "@mui/icons-material";
import {
  Avatar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import Image from "next/image";
import Options from "../pages/Options/page";
import { useState } from "react";

const Chat = () => {
  const [isUnseenMessage, setIsUnseenMessage] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const whatsappChatList = [
    {
      contactName: "John Doe",
      lastMessage: "Hi there!",
      timestamp: "10:30 AM",
      unreadCount: 2,
      avatar: "john-avatar.jpg",
    },
    {
      contactName: "Alice Smith",
      lastMessage: "Hello!",
      timestamp: "Yesterday",
      unreadCount: 0,
      avatar: "alice-avatar.jpg",
    },
    {
      contactName: "Bob Johnson",
      lastMessage: "What are you up to?",
      timestamp: "Monday",
      unreadCount: 1,
      avatar: "bob-avatar.jpg",
    },
    {
      contactName: "Emily Brown",
      lastMessage: "See you later!",
      timestamp: "Sunday",
      unreadCount: 0,
      avatar: "emily-avatar.jpg",
    },
    {
      contactName: "Michael Wilson",
      lastMessage: "Good morning!",
      timestamp: "Sunday",
      unreadCount: 3,
      avatar: "michael-avatar.jpg",
    },
    {
      contactName: "Sophia Davis",
      lastMessage: "Sure thing!",
      timestamp: "Saturday",
      unreadCount: 0,
      avatar: "sophia-avatar.jpg",
    },
    {
      contactName: "Daniel Lee",
      lastMessage: "I'm on my way.",
      timestamp: "Saturday",
      unreadCount: 2,
      avatar: "daniel-avatar.jpg",
    },
    {
      contactName: "Olivia Martinez",
      lastMessage: "Thanks a lot!",
      timestamp: "Friday",
      unreadCount: 0,
      avatar: "olivia-avatar.jpg",
    },
    {
      contactName: "James Garcia",
      lastMessage: "Happy birthday!",
      timestamp: "Friday",
      unreadCount: 1,
      avatar: "james-avatar.jpg",
    },
    {
      contactName: "Ava Hernandez",
      lastMessage: "Let's meet up!",
      timestamp: "Thursday",
      unreadCount: 0,
      avatar: "ava-avatar.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c1317] flex lg:p-5 w-full">
      <div className="flex lg:flex-row flex-col shadow w-full bg-gray-100 dark:bg-[#222e35]">
        <List className="flex flex-col lg:!w-1/3 !w-full !py-0 dark:text-white dark:bg-[#111B21] !overflow-y-auto">
          <ListItem className="!flex !h-16 !items-center !justify-between dark:bg-[#222e35]">
            <span className="!flex items-center !gap-2">
              <Avatar alt={"M"} /> <p> MKX Chat</p>
            </span>
            <span className="!flex items-center !gap-2">
              <IconButton>
                <Groups />
              </IconButton>
              <Options />
            </span>
          </ListItem>
          <Divider />
          <ListItem className="!p-2 !flex !items-center !gap-1">
            <input
              id="search"
              value={search}
              placeholder={
                isUnseenMessage
                  ? "Search from unread message"
                  : "Search or start new chat"
              }
              onChange={(event) => setSearch(event.target.value)}
              className="py-1.5 dark:bg-[#222E35] outline-none px-3 rounded-lg w-full"
            />
            <IconButton onClick={() => setIsUnseenMessage(!isUnseenMessage)}>
              <FilterList />
            </IconButton>
          </ListItem>
          <Divider />
          <div className="flex flex-col overflow-y-auto h-[77vh]">
            {isUnseenMessage && (
              <p className="p-2 text-center bg-green-700">Unread Messages</p>
            )}
            {whatsappChatList
              .filter((m) => {
                return isUnseenMessage
                  ? m.unreadCount !== 0
                  : m.unreadCount !== "";
              })
              .filter((k) =>
                k.contactName.toLowerCase().includes(search.toLowerCase())
              )
              .map((i) => {
                return (
                  <span key={i.contactName}>
                    <ListItemButton
                      className="flex items-center w-full gap-3 px-4 py-3"
                      onClick={() => setSelectedChat(i)}
                    >
                      <Avatar src="M" alt={i.contactName} />
                      <span className="flex flex-col w-full">
                        <span className="flex items-center justify-between w-full">
                          <p className="font-semibold">{i.contactName}</p>
                          <p className="text-xs">{i.timestamp}</p>
                        </span>
                        <span className="flex items-center justify-between w-full">
                          <p>{i.lastMessage}</p>
                          {i.unreadCount !== 0 && (
                            <span className="p-1 px-2 bg-green-700 rounded-full text-[9px] text-white">
                              {i.unreadCount}
                            </span>
                          )}
                        </span>
                      </span>
                    </ListItemButton>
                    <Divider />
                  </span>
                );
              })}
          </div>
        </List>
        <Divider orientation="vertical" className="lg:!block !hidden" />
        <div className="flex lg:w-2/3 w-full border-y justify-center overflow-y-auto item-center dark:border-[#202C33] border-r">
          {selectedChat ? (
            <div className="flex flex-col w-full bg-repeat bg-opacity-30 bg-blend-saturation dark:text-white">
              <div className="flex justify-between items-center h-16 p-2 dark:bg-[#222e35] w-full">
                <p className="px-3">{selectedChat.contactName}</p> <Options />
              </div>
              <Divider />
            </div>
          ) : (
            <Image
              src="/Chat-amico.svg"
              alt="My Image"
              width={500}
              height={400}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
