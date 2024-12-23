const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3001",
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    socket.on("contract", (contract) => {
      io.emit("contract", contract);
    });

  });

  server.listen(3001, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3001");
  });

  server.on("error", (err) => {
    console.error("Server error:", err);
  });
});
