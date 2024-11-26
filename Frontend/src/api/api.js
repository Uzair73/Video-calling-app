import axios from "axios";
const host = import.meta.env.VITE_BACKEND_HOST
console.log("backend host>>", host);

// login api
export const login = async(email, user_password)=>{
  const response = await axios.post(`${host}/auth/login`, email, user_password)
  const token = response.data.token
  console.log("token>>", token);
  localStorage.setItem("token", token)
  console.log("login data>>", response.data);
  return response.data
}