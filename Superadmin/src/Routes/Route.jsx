import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router-dom";

import App from "../app";
import ProtectedRoute from "./ProtectedRoute";
import Publicroute from "./Publicroute";

import Login from "../pages/Login";
import RegisterHotels from "../pages/Hotels/RegisterHotels";
import Bookings from "../pages/Hotels/Bookings";
import HotelStatus from "../pages/Hotels/HotelStatus";
import Analysis from "../pages/Analysis";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Roles from "../pages/Roles";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<Publicroute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="hotels/register" element={<RegisterHotels />} />
          <Route path="hotels/bookings" element={<Bookings />} />
          <Route path="hotels/status" element={<HotelStatus />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="users" element={<Users />} />
          <Route path="roles" element={<Roles />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </>
  )
);

export default router;
