const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const pool = require("./daos/db_connection/db_connect");

// define route path
const register = require('./routes/user_routes')

// Serve the static HTML file
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Query the database when a user connects
  pool.query("SELECT NOW()", (err, result) => {
    if (err) {
      console.error("Error executing query:", err.stack);
      socket.emit("db_error", { error: "Database query failed" });
    } else {
      console.log("Query result:", result.rows[0]);
      socket.emit("db_response", {
        message: "Database is connected",
        time: result.rows[0].now,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Correct the route definition
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/auth', register);

// Start the server
server.listen(3000, () => {
  console.log("Listening on *:3000");
});
