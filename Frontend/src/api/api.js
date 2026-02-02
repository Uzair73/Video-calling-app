import axios from "axios";
const host = import.meta.env.VITE_BACKEND_HOST
console.log("backend host>>", host);

// Helper to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get user ID from JWT token (fallback when user object not in localStorage)
export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user_id ?? payload.userId ?? null;
  } catch {
    return null;
  }
};

// login api
export const login = async(email, user_password) => {
  const response = await axios.post(`${host}/auth/login`, { email, user_password });
  console.log("login response>>", response.data);
  return response.data;
};

// register api
export const register = async (username, email, user_password) => {
  const res = await axios.post(`${host}/auth/register`, { username, email, user_password });
  console.log("data in the api>>", res.data);
  return res;
};

// Get list of rooms
export const getRooms = async () => {
  const response = await axios.get(`${host}/rooms/list-of-room`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

// Create a new room
export const createRoom = async (room_name, created_by, room_type) => {
  const response = await axios.post(`${host}/rooms/user-room`, { room_name, created_by, room_type },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Add participant to room
export const addParticipant = async (roomId, user_id) => {
  const response = await axios.post(`${host}/api/rooms/${roomId}/participants`, { user_id },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Get messages for a room
export const getMessages = async (room_id) => {
  const response = await axios.get(`${host}/users/get-messages/${room_id}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

// Get all users (for adding participants)
export const getUsers = async () => {
  const response = await axios.get(`${host}/users/user-details`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

// Get room details
export const fetchRoom = async (id) => {
  const response = await axios.get(`${host}/rooms/fetch-room/${id}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

