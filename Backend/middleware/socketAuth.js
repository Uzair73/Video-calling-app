const jwt = require("jsonwebtoken");
require("dotenv").config();

const socketAuthMiddleware = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      return next(new Error("Socket Token Not Found"));
    }
    jwt.verify(token, process.env.TOKEN_SECREAT, (err, decoded) => {
      if (err) {
        return next(new Error("Socket Authentication Error"));
      }
      socket.userId = decoded.user_id;
      next();
    });
  });
}

module.exports = { socketAuthMiddleware };