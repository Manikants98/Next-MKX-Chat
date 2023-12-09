"use client";
import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("https://socket-aap6.onrender.com");

function YourChatComponent() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    socket.on("mkx", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      console.log(msg, "msg");
    });
    return () => {
      socket.off("mkx");
    };
  }, []);

  console.log(messages, "mkx");
  const sendMessage = () => {
    if (inputMessage.trim() !== "") {
      const newMessage = { sender: "Me", content: inputMessage };
      socket.emit("mkx", newMessage);
      setInputMessage("");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}: </strong>
            <span>{msg.content}</span>
          </div>
        ))}
      </div>

      <span className="flex items-center gap-2 p-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="p-2 border rounded hover:border-gray-300 outline-blue-500"
        />
        <button
          onClick={sendMessage}
          className="p-2 px-4 text-white bg-blue-500 border rounded outline-none hover:bg-blue-600"
        >
          Send
        </button>
      </span>
    </div>
  );
}

export default YourChatComponent;
