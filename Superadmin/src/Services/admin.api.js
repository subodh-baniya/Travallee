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

// Users API
export const getUsers = async () => {
  const response = await adminClient.get("/users", { headers: authHeaders() });
  return response.data?.data || [];
};

export const banUser = async (userId) => {
  const response = await adminClient.post(`/users/${encodeURIComponent(userId)}/ban`, {}, { headers: authHeaders() });
  return response.data?.data;
};

export const unbanUser = async (userId) => {
  const response = await adminClient.post(`/users/${encodeURIComponent(userId)}/unban`, {}, { headers: authHeaders() });
  return response.data?.data;
};

// Dashboard & analytics
export const getDashboardStats = async () => {
  const response = await adminClient.get("/dashboard/stats", { headers: authHeaders() });
  return response.data?.data || {};
};

export const getRevenue7Days = async () => {
  const response = await adminClient.get("/reports/revenue-7days", { headers: authHeaders() });
  return response.data?.data || [];
};

export const getPendingApprovals = async () => {
  const response = await adminClient.get("/approvals/pending", { headers: authHeaders() });
  return response.data?.data || [];
};

export const approveItem = async (type, id) => {
  const response = await adminClient.post(`/approvals/${encodeURIComponent(type)}/${encodeURIComponent(id)}/approve`, {}, { headers: authHeaders() });
  return response.data?.data;
};

export const rejectItem = async (type, id) => {
  const response = await adminClient.post(`/approvals/${encodeURIComponent(type)}/${encodeURIComponent(id)}/reject`, {}, { headers: authHeaders() });
  return response.data?.data;
};

export const getRecentActivity = async () => {
  const response = await adminClient.get("/activity/recent", { headers: authHeaders() });
  return response.data?.data || [];
};

// Roles & admin management
export const getRoles = async () => {
  const response = await adminClient.get("/roles", { headers: authHeaders() });
  return response.data?.data || [];
};

export const createAdmin = async (payload) => {
  const response = await adminClient.post(`/admins`, payload, { headers: authHeaders() });
  return response.data?.data;
};

export const updateRolePermissions = async (roleId, permissions) => {
  const response = await adminClient.put(`/roles/${encodeURIComponent(roleId)}`, { permissions }, { headers: authHeaders() });
  return response.data?.data;
};

// Global search across users, hotels, bookings
export const globalSearch = async (q) => {
  const response = await adminClient.get(`/search?q=${encodeURIComponent(q)}`, { headers: authHeaders() });
  return response.data?.data || { users: [], hotels: [], bookings: [] };
};

// Hotel details and bookings
export const getHotelById = async (hotelId) => {
  const response = await adminClient.get(`/hotels/${encodeURIComponent(hotelId)}`, { headers: authHeaders() });
  return response.data?.data;
};

export const getHotelBookings = async (hotelId) => {
  const response = await adminClient.get(`/hotels/${encodeURIComponent(hotelId)}/bookings`, { headers: authHeaders() });
  return response.data?.data || [];
};

export const createBooking = async (hotelId, payload) => {
  const response = await adminClient.post(`/hotels/${encodeURIComponent(hotelId)}/bookings`, payload, { headers: authHeaders() });
  return response.data?.data;
};

export const getAllHotels = async () => {
  const response = await adminClient.get('/hotels', { headers: authHeaders() });
  return response.data?.data || [];
};

