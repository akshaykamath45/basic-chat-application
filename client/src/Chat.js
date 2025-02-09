import React, { useEffect } from "react";
import { useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
const Chat = ({ socket, username, room }) => {
  const [currentMesssage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
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

      // message should be visible to me also
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  // until now, we were emitting to the backend and server was listening from frontend
  // now we will listen on frontend and emit from backend
  useEffect(() => {
    socket.on("recieve_message", (data) => {
      // console.log(data);
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);
  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>

      {/* where the messages appear */}
      <div className="chat-body">
        {messageList.map((messageContent) => {
          return (
            <div
              className="message"
              id={username === messageContent.author ? "you" : "other"}
            >
              <div>
                <div className="message-content">
                  <p>{messageContent.message}</p>
                </div>
                <div className="message-meta">
                  <p id="time">{messageContent.time}</p>
                  <p id="author">{messageContent.author}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* it will have the inputs and button to write and send messages */}
      <div className="chat-footer">
        <input
          type="text"
          value={currentMesssage}
          placeholder="Hey.."
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;
