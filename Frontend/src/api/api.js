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

// register api
export const register = async (username, email, user_password)=>{
    const res = axios.post(`${host}/auth/register`,username,email,user_password)
    console.log("data in the api>>", res.data);
    return res
    
}

