const CHAT_EVENTS = {
    JOIN_ROOM: "join-room",
    LEAVE_ROOM: "leave-room",
    SEND_MESSAGE: "send-message",
    TYPING_START: "typing-start",
    TYPING_STOP: "typing-stop",
    MESSAGE_RECEIVED: "message-received",
    ROOM_HISTORY: "room-history",
  };
  
  const SOCKET_ROOM_PREFIX = "room-";
  
  module.exports = {
    CHAT_EVENTS,
    SOCKET_ROOM_PREFIX,
  };