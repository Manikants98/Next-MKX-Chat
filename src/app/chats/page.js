"use client";
import {
  Add,
  Call,
  Close,
  DoneAll,
  EmojiEmotions,
  FilterList,
  Group,
  Groups,
  Send,
  VideoCall,
} from "@mui/icons-material";
import ChatIcon from "@mui/icons-material/Chat";
import {
  Avatar,
  Button,
  Collapse,
  Divider,
  Drawer,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Skeleton,
} from "@mui/material";
import classNames from "classnames";
import moment from "moment/moment";
import Image from "next/image";
import { enqueueSnackbar as Snackbar } from "notistack";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import Loading from "../loading";
import Attachments from "../pages/attachment/page";
import Options from "../pages/options/page";
import {
  getChatsFn,
  getContactsFn,
  getMessagesFn,
  getUserFn,
  sendMessagesFn,
} from "../services/chat";
import Loader from "../shared/Loader";
import AddContacts from "./addContacts";
import io from "socket.io-client";
const socket = io("https://socket-aap6.onrender.com");

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [isUnseenMessage, setIsUnseenMessage] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [isContact, setIsContact] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isContactId, setIsContactId] = useState(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [selectMessage, setSelectMessage] = useState(null);

  const handleTouchStart = (event) => {
    setTouchStartX(event.touches[0].clientX);
  };

  let timer;

  const handleTouchMove = (event, message) => {
    const touchMoveX = event.touches[0].clientX;
    const swipeDistance = touchMoveX - touchStartX;
    setTranslateX(swipeDistance);
    timer = setTimeout(() => {
      setSelectMessage(message);
    }, 1000);
  };

  const handleTouchEnd = () => {
    setTranslateX(0);
    clearTimeout(timer);
  };

  const { data: users } = useQuery(["user"], () => getUserFn(), {
    refetchOnWindowFocus: false,
  });
  const user = users?.user;

  const { data: contacts, isLoading: isLoadingContacts } = useQuery(
    ["contacts"],
    () => getContactsFn(),
    { refetchOnWindowFocus: false }
  );
  const {
    data: messages,
    isLoading: isLoadingMessages,
    refetch,
  } = useQuery(
    ["messages", selectedChat],
    () => getMessagesFn({ chat_id: selectedChat?._id }),
    {
      refetchOnWindowFocus: false,
      enabled: Boolean(selectedChat),
    }
  );

  const { data: chats, isLoading: isLoadingChats } = useQuery(
    ["chats"],
    () => getChatsFn(),
    { refetchOnWindowFocus: false, refetchInterval: 10000 }
  );

  const { mutate: sendMessages } = useMutation(sendMessagesFn, {
    onSuccess: (response) => {
      response?.chat && setSelectedChat(response?.chat);
      setMessage("");
      socket.emit("mkx");
      setSelectMessage(null);
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const requestBody = {
      chat_id: isContact ? selectedChat?.chat_id : selectedChat?._id,
      message_type: "text",
      message: message,
      email: selectedChat?.email,
    };
    sendMessages(requestBody);
  };
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    const lastMessage =
      messages?.chat?.messages?.[messages.chat.messages.length - 1];
    if (lastMessage) {
      const lastMessageId = lastMessage._id;
      const isMobile = document.getElementById(lastMessageId);
      const isWeb = document.getElementById(messages.chat.messages.length - 1);
      if (isWeb && isMobile) {
        isMobile.scrollIntoView({ behavior: "smooth", block: "end" });
        isWeb.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
  }, [messages]);

  useEffect(() => {
    socket.on("mkx", (res) => {
      selectedChat && refetch();
    });
    return () => {
      socket.off("mkx");
    };
  }, [selectedChat]);

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <div className="bg-white dark:bg-[#0c1317] flex lg:p-5 min-h-screen h-screen max-h-screen">
        <div className="flex lg:flex-row flex-col relative shadow w-full bg-gray-100 dark:bg-[#222e35]">
          <List className="flex relative flex-col lg:!w-1/3 h-full !w-full !py-0 dark:text-white dark:bg-[#111B21] !overflow-y-auto">
            <ListItem className="!flex !p-3 !items-center !justify-between dark:bg-[#222e35]">
              <span className="!flex items-center !gap-2">
                <Avatar>{user?.first_name?.slice(0, 1)}</Avatar>{" "}
                <p className="text-lg font-bold">
                  {user?.first_name ? user?.first_name : ""}{" "}
                  {user?.last_name ? user?.last_name : ""}
                </p>
              </span>
              <span className="!flex items-center !gap-2">
                <IconButton>
                  <Groups />
                </IconButton>
                <Options />
              </span>
            </ListItem>

            <ListItem className="!p-3 !flex !items-center lg:h-auto !gap-1">
              <input
                id="search"
                value={search}
                placeholder={
                  isUnseenMessage
                    ? "Search unread chat"
                    : "Search or start new chat"
                }
                onChange={(event) => setSearch(event.target.value)}
                className="py-2 dark:bg-[#222E35] outline-none px-3 rounded-lg w-full"
              />
              <IconButton onClick={() => setIsUnseenMessage(!isUnseenMessage)}>
                <FilterList />
              </IconButton>
            </ListItem>

            {isContact ? (
              <div className="flex flex-col overflow-y-auto">
                {isUnseenMessage && (
                  <p className="p-2 text-center bg-green-700">
                    Unread Messages
                  </p>
                )}

                {!isLoadingContacts && (
                  <>
                    <AddContacts
                      isContactId={isContactId}
                      setIsContactId={setIsContactId}
                    />
                    <ListItemButton className="flex items-center w-full gap-3 px-4 py-3 font-semibold">
                      <Avatar className="!capitalize !bg-[#00A884] !text-2xl !h-12 !w-12">
                        <Group className="text-white" />
                      </Avatar>
                      New Group
                    </ListItemButton>
                  </>
                )}
                {isLoadingContacts
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
                  : contacts?.contacts?.map((i, index) => {
                      return (
                        <span key={index}>
                          <ListItemButton
                            className="flex items-center w-full gap-3 px-4 py-3"
                            onClick={() => {
                              if (i.is_chat_active) {
                                setSelectedChat(i);
                                setOpen(true);
                              } else {
                                Snackbar("This contact is not on chat.", {
                                  variant: "warning",
                                });
                              }
                            }}
                          >
                            <Avatar
                              src={i.avatar}
                              className="!capitalize !text-2xl !h-12 !w-12"
                            >
                              {i?.first_name?.slice(0, 1)}
                            </Avatar>

                            <span className="flex flex-col w-full">
                              <span className="flex items-center justify-between w-full">
                                <p className="text-lg capitalize">
                                  {(i.first_name || "") +
                                    " " +
                                    (i.last_name || "")}
                                </p>
                              </span>
                              <span className="flex items-center justify-between w-full">
                                <p className="text-xs text-gray-400">
                                  {i?.email}
                                </p>
                              </span>
                            </span>
                            {!i.is_chat_active && (
                              <Button
                                size="small"
                                color="success"
                                className="!capitalize !text-[#008069] !rounded-full"
                              >
                                Invite
                              </Button>
                            )}
                          </ListItemButton>
                          <Divider />
                        </span>
                      );
                    })}
              </div>
            ) : (
              <div className="flex flex-col overflow-y-auto">
                {isUnseenMessage && (
                  <p className="p-2 text-center bg-green-700">
                    Unread Messages
                  </p>
                )}
                {isLoadingChats
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
                  : chats?.chats?.map((i, index) => {
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
                              src={i.avatar}
                              className="!capitalize !text-2xl !h-12 !w-12"
                            >
                              {i?.chat_name?.slice(0, 1)}
                            </Avatar>

                            <span className="flex flex-col w-full">
                              <span className="flex items-center justify-between w-full">
                                <p className="text-lg capitalize">
                                  {(i.first_name || "") +
                                    " " +
                                    (i.last_name || "")}
                                  {!i.first_name && !i.last_name && i.chat_name}
                                </p>
                                <p className="text-xs">
                                  {moment(
                                    i?.recent_message?.created_at
                                  ).calendar()}
                                </p>
                              </span>
                              <span className="flex items-center justify-between w-full">
                                <p className="overflow-x-hidden text-xs text-ellipsis whitespace-nowrap w-52">
                                  {i?.recent_message?.is === "Sender" && (
                                    <DoneAll
                                      className={classNames(
                                        "!text-base",
                                        i?.recent_message?.is_read &&
                                          "!text-[#50b9e5]"
                                      )}
                                    />
                                  )}{" "}
                                  {i?.recent_message?.message}
                                </p>
                                {i.unread_count !== 0 && (
                                  <span className="p-1 px-2 bg-green-700 rounded-full text-[9px] text-white">
                                    {i.unread_count}
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
              {isContact ? (
                <ChatIcon className="text-gray-300" />
              ) : (
                <Add className="text-gray-300" />
              )}
            </Fab>
          </List>
          <Divider orientation="vertical" className="lg:!block !hidden" />
          <div className="lg:flex relative flex-col hidden lg:w-2/3 w-full border-y overflow-y-auto h-full dark:border-[#202C33] border-r">
            {selectedChat ? (
              <>
                <div className="flex absolute z-50 justify-between items-center p-2.5 dark:bg-[#222e35] w-full">
                  <span className="flex items-center gap-3 text-white">
                    <Avatar src={selectedChat?.avatar} className="!capitalize">
                      {selectedChat?.first_name?.slice(0, 1) ||
                        selectedChat?.chat_name?.slice(0, 1)}
                    </Avatar>
                    <span>
                      <p className="text-lg capitalize">
                        {(selectedChat?.first_name || "") +
                          " " +
                          (selectedChat?.last_name || "")}
                        {!selectedChat?.first_name &&
                          !selectedChat?.last_name &&
                          selectedChat?.chat_name}
                      </p>
                      <p className="text-xs lowercase">
                        last seen{" "}
                        {moment(
                          selectedChat?.recent_message?.created_at
                        ).format("dddd")}{" "}
                        at{" "}
                        {moment(
                          selectedChat?.recent_message?.created_at
                        ).format("hh:mm a")}
                      </p>
                    </span>
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

                <div className="flex dark:bg-[#111B21] flex-col h-full w-full overflow-y-auto">
                  <div className="flex-1 w-full h-full overflow-auto">
                    <div className="flex flex-col w-full gap-2 px-10">
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

                      {isLoadingMessages ? (
                        <div className="flex items-center justify-center h-96">
                          <Loader />
                        </div>
                      ) : (
                        messages?.chat?.messages?.map((i, index) => {
                          return (
                            <span key={i._id} id={index}>
                              {i.is === "Sender" && (
                                <div className="ml-auto w-fit text-white items-start rounded-lg min-w-[20%] max-w-[60%] rounded-tr-none my-1 p-2 text-sm bg-[#005c4b] flex flex-col relative speech-bubble-right">
                                  <p className="pb-1">{i.message}</p>
                                  <span className="text-[10px] flex justify-end w-full items-center gap-1 leading-none text-right text-gray-300">
                                    <p>{moment(i.created_at).calendar()}</p>{" "}
                                    <DoneAll
                                      className={classNames(
                                        "!text-base",
                                        i.is_read && "!text-[#50b9e5]"
                                      )}
                                    />
                                  </span>
                                </div>
                              )}
                              {i.is === "Receiver" && (
                                <div className="mr-auto w-fit text-white rounded-lg min-w-[20%] max-w-[60%] rounded-tl-none my-1 p-2 text-sm bg-[#202c33] flex flex-col relative speech-bubble-left">
                                  <p className="pb-1"> {i.message} </p>
                                  <p className="text-[10px] text-gray-300 text-end">
                                    {moment(i.created_at).calendar()}
                                  </p>
                                </div>
                              )}
                            </span>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
                <form
                  onSubmit={(event) => handleSubmit(event)}
                  className="flex bottom-0 z-50 gap-2 items-center p-2 dark:text-white dark:bg-[#111B21] w-full"
                >
                  <div className="dark:bg-[#222E35] flex items-center w-full px-1 rounded-full">
                    <IconButton size="small">
                      <EmojiEmotions />
                    </IconButton>
                    <Attachments />
                    <input
                      id="message"
                      value={message}
                      placeholder="Type a message"
                      onChange={(event) => setMessage(event.target.value)}
                      className="w-full px-3 py-2 bg-transparent outline-none"
                    />
                  </div>

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
          component="div"
          PaperProps={{
            className: "h-screen py-16 !relative dark:!bg-[#222e35]",
          }}
          anchor="bottom"
          onClose={() => {
            setOpen(false);
            setSelectedChat(null);
          }}
        >
          <div className="absolute z-50 top-0 bg-[#222E35] flex items-center justify-between w-full p-3">
            <span className="flex items-center gap-3">
              <Avatar src={selectedChat?.avatar} className="!capitalize">
                {selectedChat?.first_name?.slice(0, 1) ||
                  selectedChat?.chat_name?.slice(0, 1)}
              </Avatar>

              <span>
                <p className="text-lg capitalize">
                  {(selectedChat?.first_name || "") +
                    " " +
                    (selectedChat?.last_name || "")}
                  {!selectedChat?.first_name &&
                    !selectedChat?.last_name &&
                    selectedChat?.chat_name}
                </p>
                <p className="text-xs lowercase">
                  last seen{" "}
                  {moment(selectedChat?.recent_message?.created_at).format(
                    "dddd"
                  )}{" "}
                  at{" "}
                  {moment(selectedChat?.recent_message?.created_at).format(
                    "hh:mm a"
                  )}
                </p>
              </span>
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
          <div className="flex flex-col w-full dark:!bg-[#111B21] h-full overflow-y-auto">
            <div className="flex-1 w-full h-full overflow-auto hide-scroll">
              <div className="flex flex-col gap-2 px-4">
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

                {isLoadingMessages ? (
                  <div className="flex items-center justify-center h-96">
                    <Loader />
                  </div>
                ) : (
                  messages?.chat?.messages?.map((i) => {
                    return (
                      <span key={i._id} id={i._id}>
                        {i.is === "Sender" && (
                          <div
                            className="ml-auto w-fit text-white rounded-lg min-w-[20%] max-w-[60%] rounded-tr-none my-1 p-2 text-sm bg-[#005c4b] flex flex-col relative speech-bubble-right"
                            onTouchStart={handleTouchStart}
                            onTouchMove={(event) => handleTouchMove(event, i)}
                            onTouchEnd={handleTouchEnd}
                            style={{
                              transform:
                                selectMessage?._id === i._id &&
                                `translateX(${translateX}px)`,
                              transition: "transform 0.3s ease-out",
                            }}
                          >
                            <p className="pb-1">{i.message}</p>
                            <span className="text-[10px] flex justify-end w-full items-center gap-1 leading-none text-right text-gray-300">
                              <p>{moment(i.created_at).calendar()}</p>{" "}
                              <DoneAll
                                className={classNames(
                                  "!text-base",
                                  i.is_read && "!text-[#50b9e5]"
                                )}
                              />
                            </span>
                          </div>
                        )}
                        {i.is === "Receiver" && (
                          <div
                            className="mr-auto w-fit text-white rounded-lg min-w-[20%] max-w-[60%] rounded-tl-none my-1 p-2 text-sm bg-[#202c33] flex flex-col relative speech-bubble-left"
                            onTouchStart={handleTouchStart}
                            onTouchMove={(event) => handleTouchMove(event, i)}
                            onTouchEnd={handleTouchEnd}
                            style={{
                              transform:
                                selectMessage?._id === i._id &&
                                `translateX(${translateX}px)`,
                              transition: "transform 0.3s ease-out",
                            }}
                          >
                            <p className="pb-1"> {i.message} </p>
                            <p className="text-[10px] text-gray-300 text-end">
                              {moment(i.created_at).calendar()}
                            </p>
                          </div>
                        )}
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <form
            onSubmit={(event) => handleSubmit(event)}
            className="flex items-end absolute bottom-0 gap-2 p-2 dark:bg-[#111B21] w-full"
          >
            <div
              className={classNames(
                "flex flex-col dark:bg-[#222E35] px-2 py-1 outline-none w-full",
                selectMessage ? "rounded-b-2xl rounded-t-lg" : "rounded-full"
              )}
            >
              <Collapse in={Boolean(selectMessage)} className="">
                <span className="border-l-4 rounded border-purple-500 dark:bg-[#1b252b] flex flex-col p-1 pl-2">
                  <span className="relative flex items-center justify-between">
                    <p className="text-sm font-semibold text-purple-500">
                      {selectedChat?.chat_name}
                    </p>
                    <Close
                      className="!text-gray-500 !text-lg absolute top-0 right-0 lg:cursor-pointer hover:!text-gray-400"
                      onClick={() => setSelectMessage(null)}
                    />
                  </span>{" "}
                  <p>{selectMessage?.message}</p>
                </span>
              </Collapse>{" "}
              <div className="flex items-center">
                <IconButton size="small">
                  <EmojiEmotions />
                </IconButton>
                <input
                  id="message"
                  value={message}
                  placeholder="Type a message"
                  onChange={(event) => setMessage(event.target.value)}
                  className="w-full px-3 py-2 bg-transparent outline-none"
                />
                <Attachments />
              </div>
            </div>
            <IconButton type="submit" className="!bg-[#005c4b] !h-12 !w-12">
              <Send />
            </IconButton>
          </form>
        </Drawer>
      </div>
    </>
  );
};

export default Chat;
