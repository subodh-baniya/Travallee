import axios from "axios";

export const authClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_BASE_URL || "http://localhost:3000/api/v1/users",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
