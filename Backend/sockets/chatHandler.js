const pool = require("../daos/db_connection/db_connect");
const { send_msg, fetch_messages } = require("../Models/message/user_messages");
const { CHAT_EVENTS, SOCKET_ROOM_PREFIX } = require("../constants/socketConstant");

const isParticipant = (userId, roomId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT 1 FROM room_participants WHERE user_id = $1 AND room_id = $2",
      [userId, roomId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows.length > 0);
      }
    );
  });
}

const roomName = (roomId) => {
  return SOCKET_ROOM_PREFIX + roomId;
}

const chatHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id, "userId:", socket.userId);
    socket.on(CHAT_EVENTS.JOIN_ROOM, async (data, callback) => {
      const { roomId } = data || {};
      if (!roomId) {
        if (callback) callback({ ok: false, message: "roomId required" });
        return;
      }
      try {
        const allowed = await isParticipant(socket.userId, roomId);
        if (!allowed) {
          if (callback) callback({ ok: false, message: "Not a participant" });
          return;
        }
        socket.join(roomName(roomId));
        if (callback) callback({ ok: true, message: "Joined room" });
        const messages = await fetch_messages(roomId);
        socket.emit(CHAT_EVENTS.ROOM_HISTORY, { roomId, messages });
      } catch (err) {
        console.error("join-room error", err);
        if (callback) callback({ ok: false, message: "Server error" });
      }
    });
    socket.on(CHAT_EVENTS.LEAVE_ROOM, (data) => {
      const { roomId } = data || {};
      if (roomId) socket.leave(roomName(roomId));
    });
    socket.on(CHAT_EVENTS.SEND_MESSAGE, async (data, callback) => {
      const { roomId, content } = data || {};
      if (!roomId || !content || !String(content).trim()) {
        if (callback) callback({ ok: false, message: "roomId and content required" });
        return;
      }
      try {
        const allowed = await isParticipant(socket.userId, roomId);
        if (!allowed) {
          if (callback) callback({ ok: false, message: "Not a participant" });
          return;
        }
        const saved = await send_msg(roomId, socket.userId, String(content).trim());
        io.to(roomName(roomId)).emit(CHAT_EVENTS.MESSAGE_RECEIVED, {
          id: saved.id,
          room_id: saved.room_id,
          sender_id: saved.sender_id,
          content: saved.content,
          send_at: saved.send_at,
        });
        if (callback) callback({ ok: true, data: saved });
      } catch (err) {
        console.error("send-message error", err);
        if (callback) callback({ ok: false, message: "Failed to send" });
      }
    });
    socket.on(CHAT_EVENTS.TYPING_START, (data) => {
      const { roomId } = data || {};
      if (roomId) {
        socket.to(roomName(roomId)).emit(CHAT_EVENTS.TYPING_START, { userId: socket.userId });
      }
    });
    socket.on(CHAT_EVENTS.TYPING_STOP, (data) => {
      const { roomId } = data || {};
      if (roomId) {
        socket.to(roomName(roomId)).emit(CHAT_EVENTS.TYPING_STOP, { userId: socket.userId });
      }
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}

module.exports = { chatHandlers };