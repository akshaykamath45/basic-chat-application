const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

// connect socket io server with express server
// can also fix cors issues
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// socket io based on events, you emit an event, you detect and listen for event to happen

// if someone connected to this socket io server
// each user gets a specific id, when they connect to the socket server, so we can access information from the socket object passed in the callback function
io.on("connection", (socket) => {
  console.log(`User connected  ${socket.id}`);

  // passing room id through data
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID : ${socket.id} joined room: ${data}`);
  });

  // impt
  socket.on("send_message", (data) => {
    console.log(data);
    // send the message only in that room
    socket.to(data.room).emit("recieve_message", data);
  });
  socket.on("disconnect", () => {
    console.log(`User disconnected  ${socket.id}`);
  });
});

server.listen(3001, () => {
  console.log("Server is listening at port 3001");
});
