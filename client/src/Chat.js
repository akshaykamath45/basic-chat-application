import React, { useEffect } from "react";
import { useState } from "react";
const Chat = ({ socket, username, room }) => {
  const [currentMesssage, setCurrentMessage] = useState("");
  const sendMessage = async () => {
    if (currentMesssage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMesssage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
    }
  };

  // until now, we were emitting to the backend and server was listening from frontend
  // now we will listen on frontend and emit from backend
  useEffect(() => {
    socket.on("recieve_message", (data) => {
      console.log(data);
    });
  }, [socket]);
  return (
    <div>
      <div className="chat-header">
        <p>Live Chat</p>
      </div>

      {/* where the messages appear */}
      <div className="chat-body"></div>

      {/* it will have the inputs and button to write and send messages */}
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Hey.."
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;
