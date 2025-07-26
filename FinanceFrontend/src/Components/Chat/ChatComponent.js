import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const ChatComponent = ({ currentUser, chatWith }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatBoxRef = useRef(null);

  // Fetch old messages from MongoDB
  useEffect(() => {
    axios
      .get(`http://localhost:5000/messages?sender=${currentUser}&receiver=${chatWith}`)
      .then((res) => setChat(res.data))
      .catch((err) => console.error("Failed to load messages", err));
  }, [currentUser, chatWith]);

  // Receive new messages via Socket.IO
  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (
        (data.sender === currentUser && data.receiver === chatWith) ||
        (data.sender === chatWith && data.receiver === currentUser)
      ) {
        setChat((prev) => [...prev, data]);
      }
    });

    return () => socket.off("receive_message");
  }, [currentUser, chatWith]);

  // Scroll to bottom when new message appears
  useEffect(() => {
    chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
  }, [chat]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const data = { sender: currentUser, receiver: chatWith, message };
    socket.emit("send_message", data);
    setChat((prev) => [...prev, data]);
    setMessage("");
  };

  return (
    <div>
      <h3>Chat with {chatWith}</h3>
      <div
        ref={chatBoxRef}
        style={{
          border: "1px solid #ccc",
          padding: 10,
          height: 250,
          overflowY: "auto",
          background: "#f9f9f9",
          marginBottom: 10,
        }}
      >
        {chat.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.sender === currentUser ? "right" : "left",
              margin: "5px 0",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: m.sender === currentUser ? "#dcf8c6" : "#fff",
                padding: "8px 12px",
                borderRadius: "20px",
                maxWidth: "70%",
              }}
            >
              <strong>{m.sender}</strong>: {m.message}
              <div style={{ fontSize: "10px", color: "#666", marginTop: 2 }}>
                {new Date(m.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        placeholder="Type your message..."
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        style={{ width: "75%", padding: 8, marginRight: 5 }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatComponent;
