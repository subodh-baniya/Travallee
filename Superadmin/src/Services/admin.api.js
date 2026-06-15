import axios from "axios";
import { AUTH_STORAGE_KEY } from "../Types/auth.types.js";

const adminClient = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API_BASE_URL || "http://localhost:4001/api/v1/admin",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAuthToken = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "null");
    return stored?.token;
  } catch {
    return null;
  }
};

const authHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getPendingRegistrations = async () => {
  const response = await adminClient.get("/hotel-registrations", {
    headers: authHeaders(),
  });
  return response.data?.data || [];
};

export const approveRegistration = async (userID) => {
  const response = await adminClient.post(
    `/hotel-registrations/${encodeURIComponent(userID)}/approve`,
    {},
    { headers: authHeaders() }
  );
  return response.data?.data;
};

export const declineRegistration = async (userID) => {
  const response = await adminClient.post(
    `/hotel-registrations/${encodeURIComponent(userID)}/decline`,
    {},
    { headers: authHeaders() }
  );
  return response.data?.data;
};
