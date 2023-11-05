"use client";
import {
  Call,
  Close,
  EmojiEmotions,
  FilterList,
  Groups,
  Send,
  VideoCall,
} from "@mui/icons-material";
import {
  Avatar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Skeleton,
} from "@mui/material";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import Attachments from "../pages/Attachment/page";
import Options from "../pages/Options/page";
import SignUp from "../auth/signup/page";
// import { sql } from "@vercel/postgres";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [isUnseenMessage, setIsUnseenMessage] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const { rows } = sql`SELECT * from users`;
  const chatsFn = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api");
      setChats(response.data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    chatsFn();
  }, []);
  const handleSubmit = (event) => {
    event.preventDefault();
  };
  // console.log(rows, "mkx");
  return (
    <div className="min-h-screen bg-white dark:bg-[#0c1317] flex lg:p-5">
      <div className="flex lg:flex-row flex-col relative shadow w-full bg-gray-100 dark:bg-[#222e35]">
        <List className="flex flex-col lg:!w-1/3 !w-full !py-0 dark:text-white dark:bg-[#111B21] !overflow-y-auto">
          <ListItem className="!flex lg:border-b-none border-b border-gray-400 dark:border-gray-700 !items-center lg:h-16 h-[8vh] !justify-between dark:bg-[#222e35]">
            <span className="!flex items-center !gap-2">
              <SignUp /> <p> MKX Chat</p>
            </span>
            <span className="!flex items-center !gap-2">
              <IconButton>
                <Groups />
              </IconButton>
              <Options />
            </span>
          </ListItem>
          <Divider className="lg:!block !hidden" />
          <ListItem className="!p-2 lg:border-b-none border-b border-gray-400 dark:border-gray-700 !flex !items-center lg:h-auto h-[8vh] !gap-1">
            <input
              id="search"
              value={search}
              placeholder={
                isUnseenMessage
                  ? "Search unread chat"
                  : "Search or start new chat"
              }
              onChange={(event) => setSearch(event.target.value)}
              className="py-1.5 dark:bg-[#222E35] outline-none px-3 rounded-lg w-full"
            />
            <IconButton onClick={() => setIsUnseenMessage(!isUnseenMessage)}>
              <FilterList />
            </IconButton>
          </ListItem>
          <Divider className="lg:!block !hidden" />
          <div className="flex flex-col overflow-y-auto lg:h-[76vh] h-[84vh]">
            {isUnseenMessage && (
              <p className="p-2 text-center bg-green-700">Unread Messages</p>
            )}
            {isLoading
              ? [1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => {
                  return (
                    <span key={index}>
                      <ListItem className="flex items-center w-full gap-3 px-4 py-3">
                        <Skeleton className="!h-10 !w-11 !rounded-full !scale-100" />
                        <span className="flex flex-col w-full">
                          <span className="flex items-center justify-between w-full">
                            <Skeleton className="!w-40" />
                            <Skeleton className="!w-20" />
                          </span>
                          <span className="flex items-center justify-between w-full">
                            <Skeleton className="!w-44" />
                            <Skeleton className="!w-10" />
                          </span>
                        </span>
                      </ListItem>
                      <Divider />
                    </span>
                  );
                })
              : chats
                  .filter((m) => {
                    return isUnseenMessage
                      ? m.unreadCount !== 0
                      : m.unreadCount !== "";
                  })
                  .filter((k) =>
                    k.contactName.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((i, index) => {
                    return (
                      <span key={index}>
                        <ListItemButton
                          className="flex items-center w-full gap-3 px-4 py-3"
                          onClick={() => {
                            setSelectedChat(i);
                            setOpen(true);
                          }}
                        >
                          <Avatar
                            src={`https://source.unsplash.com/random/200x200/?girls/${index}`}
                            alt={i.contactName}
                          />
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
        <div className="lg:flex flex-col hidden lg:w-2/3 w-full border-y justify-center overflow-y-auto item-center dark:border-[#202C33] border-r">
          {selectedChat ? (
            <>
              <div className="flex justify-between items-center h-[9vh] p-2 dark:bg-[#222e35] w-full">
                <span className="flex items-center gap-2">
                  <Avatar>{selectedChat?.contactName?.slice(0, 1)}</Avatar>
                  <p className="px-3 dark:text-white">
                    {selectedChat?.contactName}
                  </p>
                </span>{" "}
                <span className="flex items-center gap-2">
                  <IconButton onClick={() => setOpen(false)}>
                    <VideoCall />
                  </IconButton>
                  <IconButton onClick={() => setOpen(false)}>
                    <Call />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setOpen(false);
                      setSelectedChat(null);
                    }}
                  >
                    <Close />
                  </IconButton>
                </span>
              </div>
              <Divider />
              <div className="flex flex-col w-full h-[76vh] overflow-y-auto">
                <div className="flex-1 w-full h-full overflow-auto">
                  <div className="flex flex-col gap-2 px-3 py-2">
                    <div className="flex justify-center mb-4">
                      <div
                        className="px-4 py-1 rounded"
                        style={{ backgroundColor: "#FCF4CB" }}
                      >
                        <p className="text-xs text-black">
                          Messages to this chat and calls are now secured with
                          end-to-end encryption. Tap for more info.
                        </p>
                      </div>
                    </div>

                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(() => {
                      return (
                        <>
                          <div className="flex mb-2">
                            <div
                              className="w-4/6 px-3 py-2 text-black rounded"
                              style={{ backgroundColor: "#F2F2F2" }}
                            >
                              <p className="text-sm ">Sylvester Stallone</p>
                              <p className="mt-1 text-sm">
                                Hi everyone! Glad you could join! I am making a
                                new movie.
                              </p>
                              <p className="mt-1 text-xs text-right text-grey-dark">
                                12:45 pm
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-end mb-2">
                            <div
                              className="w-4/6 px-3 py-2 text-black rounded"
                              style={{ backgroundColor: "#F2F2F2" }}
                            >
                              <p className="text-sm ">Sylvester Stallone</p>
                              <p className="mt-1 text-sm">
                                Hi everyone! Glad you could join! I am making a
                                new movie.
                              </p>
                              <p className="mt-1 text-xs text-right text-grey-dark">
                                12:45 pm
                              </p>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </div>
              </div>
              <form
                onSubmit={(event) => handleSubmit(event)}
                className="flex gap-2 items-center h-[9vh] p-2 dark:text-white dark:bg-[#111B21] w-full"
              >
                <IconButton>
                  <EmojiEmotions />
                </IconButton>
                <Attachments />
                <input
                  id="search"
                  value={search}
                  placeholder="Type a message"
                  onChange={(event) => setSearch(event.target.value)}
                  className="py-2 dark:bg-[#222E35] outline-none px-3 rounded-lg w-full"
                />
                <IconButton type="submit">
                  <Send />
                </IconButton>
              </form>
            </>
          ) : (
            <span className="flex items-center justify-center w-full h-full">
              <Image
                src="/Chat-amico.svg"
                alt="My Image"
                width={500}
                height={400}
              />
            </span>
          )}
        </div>
      </div>
      <Drawer
        className="lg:!hidden flex flex-col"
        open={open}
        PaperProps={{ className: "h-screen !relative dark:!bg-[#222e35]" }}
        anchor="bottom"
        onClose={() => setOpen(false)}
      >
        <div className="flex absolute top-0 justify-between items-center h-[9vh] p-2 dark:bg-[#222e35] w-full">
          <span className="flex items-center">
            <Avatar>{selectedChat?.contactName?.slice(0, 1)}</Avatar>
            <p className="px-3 dark:text-white">{selectedChat?.contactName}</p>
          </span>
          <span className="flex items-center gap-2">
            <IconButton onClick={() => setOpen(false)}>
              <VideoCall />
            </IconButton>
            <IconButton onClick={() => setOpen(false)}>
              <Call />
            </IconButton>
            <IconButton onClick={() => setOpen(false)}>
              <Close />
            </IconButton>
          </span>
        </div>
        <div className="flex flex-col w-full h-full overflow-y-auto my-[9vh]">
          <div className="flex-1 w-full h-full overflow-auto">
            <div className="flex flex-col gap-2 px-3 py-2">
              <div className="flex justify-center mb-4">
                <div
                  className="px-4 py-1 rounded"
                  style={{ backgroundColor: "#FCF4CB" }}
                >
                  <p className="text-xs text-black">
                    Messages to this chat and calls are now secured with
                    end-to-end encryption. Tap for more info.
                  </p>
                </div>
              </div>

              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(() => {
                return (
                  <>
                    <div className="flex mb-2">
                      <div
                        className="w-4/6 px-3 py-2 text-black rounded"
                        style={{ backgroundColor: "#F2F2F2" }}
                      >
                        <p className="text-sm ">Sylvester Stallone</p>
                        <p className="mt-1 text-sm">
                          Hi everyone! Glad you could join! I am making a new
                          movie.
                        </p>
                        <p className="mt-1 text-xs text-right text-grey-dark">
                          12:45 pm
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end mb-2">
                      <div
                        className="w-4/6 px-3 py-2 text-black rounded"
                        style={{ backgroundColor: "#F2F2F2" }}
                      >
                        <p className="text-sm ">Sylvester Stallone</p>
                        <p className="mt-1 text-sm">
                          Hi everyone! Glad you could join! I am making a new
                          movie.
                        </p>
                        <p className="mt-1 text-xs text-right text-grey-dark">
                          12:45 pm
                        </p>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        </div>

        <form
          onSubmit={(event) => handleSubmit(event)}
          className="flex absolute bottom-0 gap-2 items-center h-[9vh] p-2 dark:bg-[#111B21] w-full"
        >
          <IconButton>
            <EmojiEmotions />
          </IconButton>
          <Attachments />
          <input
            id="search"
            value={search}
            placeholder="Type a message"
            onChange={(event) => setSearch(event.target.value)}
            className="py-2 dark:bg-[#222E35] outline-none px-3 rounded-lg w-full"
          />
          <IconButton type="submit">
            <Send />
          </IconButton>
        </form>
      </Drawer>
    </div>
  );
};

export default Chat;
