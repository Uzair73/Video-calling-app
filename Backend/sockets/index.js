const { Server } = require("socket.io");
const { socketAuthMiddleware } = require("../middleware/socketAuth");
const { chatHandlers } = require("./chatHandler");

const SocketServer = (httpServer, options = {}) => {
  const corsOrigin = options.corsOrigin || "http://localhost:5173";
  const io = new Server(httpServer, {
    cors: {
      origin: corsOrigin,
      methods: ["GET", "POST"],
    },
  });
  socketAuthMiddleware(io);
  chatHandlers(io);
  return io;
}

module.exports = { SocketServer };