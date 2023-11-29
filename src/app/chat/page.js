"use client";
import {
  Add,
  Call,
  Close,
  EmojiEmotions,
  FilterList,
  Groups,
  Send,
  VideoCall,
} from "@mui/icons-material";
import ChatIcon from "@mui/icons-material/Chat";
import {
  Avatar,
  Divider,
  Drawer,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Skeleton,
} from "@mui/material";
import moment from "moment/moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { enqueueSnackbar as Snackbar } from "notistack";
import { useEffect, useState } from "react";
import Loading from "../loading";
import Attachments from "../pages/attachment/page";
import Options from "../pages/options/page";
import axiosInstance from "../utils/axiosInstance";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [isUnseenMessage, setIsUnseenMessage] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [isloadingChats, setIsLoadingChats] = useState(false);
  const [chats, setChats] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [user, setUser] = useState({});
  const [isContact, setIsContact] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();
  const fetchChats = async () => {
    setIsLoadingChats(true);
    try {
      const response = await axiosInstance.get("api/chats");
      setChats(response.data.chats);
      setIsLoadingChats(false);
    } catch (error) {
      setIsLoadingChats(false);
      throw error;
    }
  };
  const fetchContacts = async () => {
    setIsLoadingChats(true);
    try {
      const response = await axiosInstance.get("api/contacts");
      setContacts(response.data.contacts);
      setIsLoadingChats(false);
    } catch (error) {
      setIsLoadingChats(false);
      throw error;
    }
  };
  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get("api/users");
      setUser(response.data.user);
    } catch (error) {
      throw error;
    }
  };
  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get("api/messages", {
        params: { chat_id: selectedChat?._id },
      });
      setMessages(response.data.chat?.messages);
    } catch (error) {
      throw error;
    }
  };
  useEffect(() => {
    if (isLogin) {
      fetchChats();
      fetchUser();
    }
  }, [isLogin]);

  useEffect(() => {
    isContact && fetchContacts();
  }, [isContact]);

  useEffect(() => {
    selectedChat && fetchMessages();
  }, [selectedChat]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const requestBody = {
      avatar: selectedChat?.avatar,
      chat_name: selectedChat?.first_name + " " + selectedChat?.last_name,
      first_name: selectedChat?.first_name,
      last_name: selectedChat?.last_name,
      email: selectedChat?.email,
      mobile_number: selectedChat?.mobile_number,
      contact_id: selectedChat?._id,
      recent_message: { message },
    };
    try {
      const response = isContact
        ? await axiosInstance.post("api/chats", requestBody)
        : await axiosInstance.post("api/messages", {
            chat_id: selectedChat?._id,
            message_type: "text",
            message: message,
          });

      Snackbar(
        response?.data?.message?.charAt(0).toUpperCase() +
          response?.data?.message?.slice(1),
        { variant: "success" }
      );
      isContact ? fetchChats() : fetchMessages();
      setMessage("");
    } catch (error) {
      throw Error(error);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("token")) {
        setIsLogin(true);
      }
    }
  }, []);
  const handleCheckLogin = async () => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("token")) {
        setIsLogin(true);
      } else {
        router.push("/auth/signin");
      }
    }
  };

  useEffect(() => {
    handleCheckLogin();
  }, []);
  return isLoading ? (
    <Loading />
  ) : (
    <>
      <div className="min-h-screen bg-white dark:bg-[#0c1317] flex lg:p-5">
        <div className="flex lg:flex-row flex-col relative shadow w-full bg-gray-100 dark:bg-[#222e35]">
          <List className="flex relative flex-col lg:!w-1/3 !w-full !py-0 dark:text-white dark:bg-[#111B21] !overflow-y-auto">
            <ListItem className="!flex !items-center lg:h-14 h-[8vh] !justify-between dark:bg-[#222e35]">
              <span className="!flex items-center !gap-2">
                <Avatar>{user?.first_name?.slice(0, 1)}</Avatar>{" "}
                <p className="text-lg font-bold">
                  {user?.first_name || ""} {user?.last_name || ""}
                </p>
              </span>
              <span className="!flex items-center !gap-2">
                <IconButton>
                  <Groups />
                </IconButton>
                <Options />
              </span>
            </ListItem>

            <ListItem className="!p-2 !flex !items-center lg:h-auto h-[8vh] !gap-1">
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

            {isContact ? (
              <div className="flex flex-col overflow-y-auto lg:h-[76vh] h-[84vh]">
                {isUnseenMessage && (
                  <p className="p-2 text-center bg-green-700">
                    Unread Messages
                  </p>
                )}
                {isloadingChats
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
                  : contacts?.map((i, index) => {
                      return (
                        <span key={index}>
                          <ListItemButton
                            className="flex items-center w-full gap-3 px-4 py-3"
                            onClick={() => {
                              setSelectedChat(i);
                              setOpen(true);
                            }}
                          >
                            <Avatar src={i.avatar}>
                              {i?.first_name?.slice(0, 1)}
                            </Avatar>

                            <span className="flex flex-col w-full">
                              <span className="flex items-center justify-between w-full">
                                <p className="font-semibold">
                                  {i.first_name + " " + i.last_name}
                                </p>
                              </span>
                              <span className="flex items-center justify-between w-full">
                                <p>{i?.recent_message?.message}</p>
                                {i.unreadCount !== 0 && (
                                  <span className="p-1 px-2 bg-green-700 rounded-full text-[9px] text-white">
                                    {index + 1}
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
            ) : (
              <div className="flex flex-col overflow-y-auto lg:h-[76vh] h-[84vh]">
                {isUnseenMessage && (
                  <p className="p-2 text-center bg-green-700">
                    Unread Messages
                  </p>
                )}
                {isloadingChats
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
                  : chats?.map((i, index) => {
                      return (
                        <span key={index}>
                          <ListItemButton
                            className="flex items-center w-full gap-3 px-4 py-3"
                            onClick={() => {
                              setSelectedChat(i);
                              setOpen(true);
                            }}
                          >
                            <Avatar src={i.avatar}>
                              {i?.first_name?.slice(0, 1)}
                            </Avatar>

                            <span className="flex flex-col w-full">
                              <span className="flex items-center justify-between w-full">
                                <p className="font-semibold">
                                  {i.first_name + " " + i.last_name}
                                </p>
                                <p className="text-xs">
                                  {moment(i.last_modified_date).format("dddd")}
                                </p>
                              </span>
                              <span className="flex items-center justify-between w-full">
                                <p className="text-xs">
                                  {i?.recent_message?.message}
                                </p>
                                {i.unreadCount !== 0 && (
                                  <span className="p-1 px-2 bg-green-700 rounded-full text-[9px] text-white">
                                    {index + 1}
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
            )}
            <Fab
              className="!absolute !bg-green-700 hover:!bg-green-800 !right-5 !bottom-5"
              onClick={() => setIsContact(!isContact)}
            >
              {isContact ? <ChatIcon /> : <Add />}
            </Fab>
          </List>
          <Divider orientation="vertical" className="lg:!block !hidden" />
          <div className="lg:flex flex-col hidden lg:w-2/3 w-full border-y justify-center overflow-y-auto item-center dark:border-[#202C33] border-r">
            {selectedChat ? (
              <>
                <div className="flex justify-between items-center lg:h-14 h-[8vh] p-2 dark:bg-[#222e35] w-full">
                  <span className="flex items-center gap-1">
                    <Avatar src={selectedChat.avatar}>
                      {selectedChat?.first_name?.slice(0, 1)}
                    </Avatar>
                    <p className="px-3 dark:text-white">
                      {selectedChat?.first_name + " " + selectedChat?.last_name}
                    </p>
                  </span>
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

                <div className="flex dark:bg-[#111B21] flex-col w-full h-[78vh] overflow-y-auto">
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

                      {messages.map((i) => {
                        return (
                          <span key={i}>
                            <div className="flex justify-end mb-2">
                              <div
                                className="w-4/6 px-3 py-1 text-black rounded"
                                style={{ backgroundColor: "#F2F2F2" }}
                              >
                                <p className="font-semibold">
                                  {selectedChat?.first_name +
                                    " " +
                                    selectedChat?.last_name}
                                </p>
                                <p className="mt-1 text-sm">{i.message}</p>
                                <p className="mt-1 text-xs text-right text-grey-dark">
                                  {moment(i.created_at).calendar()}
                                </p>
                              </div>
                            </div>
                          </span>
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
                    id="message"
                    value={message}
                    placeholder="Type a message"
                    onChange={(event) => setMessage(event.target.value)}
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
          <div className="flex absolute top-0 justify-between items-center h-[9vh] p-2 bg-opacity-10 dark:bg-[#222e35] w-full">
            <span className="flex items-center">
              <Avatar src={selectedChat?.avatar}>
                {selectedChat?.first_name?.slice(0, 1)}
              </Avatar>
              <p className="px-3 dark:text-white">
                {selectedChat?.first_name + " " + selectedChat?.last_name}
              </p>
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
                    <p className="text-xs text-center text-black">
                      Messages to this chat and calls are now secured with
                      end-to-end encryption. Tap for more info.
                    </p>
                  </div>
                </div>

                {messages.map((i) => {
                  return (
                    <span key={i}>
                      <div className="flex justify-end mb-2">
                        <div
                          className="w-4/6 px-3 py-1 text-black rounded"
                          style={{ backgroundColor: "#F2F2F2" }}
                        >
                          <p className="font-semibold">
                            {selectedChat?.first_name +
                              " " +
                              selectedChat?.last_name}
                          </p>
                          <p className="mt-1 text-sm">{i.message}</p>
                          <p className="mt-1 text-xs text-right text-grey-dark">
                            {moment(i.created_at).calendar()}
                          </p>
                        </div>
                      </div>
                    </span>
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
              id="message"
              value={message}
              placeholder="Type a message"
              onChange={(event) => setMessage(event.target.value)}
              className="py-2 dark:bg-[#222E35] outline-none px-3 rounded-lg w-full"
            />
            <IconButton type="submit">
              <Send />
            </IconButton>
          </form>
        </Drawer>
      </div>
    </>
  );
};

export default Chat;
