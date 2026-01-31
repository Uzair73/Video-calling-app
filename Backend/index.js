const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const cors = require("cors"); // Added for CORS
const { SocketServer } = require("./sockets/index");
require("dotenv").config();
// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// define route path
const auth_routes = require('./routes/auth_routes')
const user_route = require('./routes/user_routes')
const participant_route = require('./routes/room_participant')
const rooms_route = require('./routes/room_routes')

//route define
app.use('/auth', auth_routes);
app.use('/users', user_route)
app.use('/api', participant_route);
app.use('/rooms', rooms_route);

// Socket.IO setup
SocketServer(server, { corsOrigin: process.env.FRONTEND_URL || "http://localhost:5173" });

// Start the server
server.listen(process.env.PORT, () => {
  console.log(`Listening on *:${process.env.PORT}`);
});
