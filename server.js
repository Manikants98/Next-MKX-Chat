const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("socket.io server");
});

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("User connected");
  socket.on("chat message", (msg) => {
    console.log("Message received:", msg);
    io.emit("chat message", msg);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
