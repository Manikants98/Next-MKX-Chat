"use client";
import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

function YourChatComponent() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
    return () => {
      socket.off("chat message");
    };
  }, []);

  const sendMessage = () => {
    if (inputMessage.trim() !== "") {
      const newMessage = { sender: "Me", content: inputMessage };
      socket.emit("chat message", newMessage);
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
