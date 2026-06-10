import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router-dom";

import App from "../app";
import ProtectedRoute from "./ProtectedRoute";
import Publicroute from "./Publicroute";

import Login from "../pages/Login";
import RegisterHotels from "../pages/Hotels/RegisterHotels";
import Bookings from "../pages/Hotels/Bookings";
import HotelStatus from "../pages/Hotels/HotelStatus";
import Banners from "../pages/App/Banners";
import RedeemCode from "../pages/App/RedeemCode";
import AppUsers from "../pages/App/AppUsers";
import BlockUsers from "../pages/App/BlockUsers";
import Analysis from "../pages/Analysis";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<Publicroute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<App />}>
          <Route index element={<Navigate to="app/banners" replace />} />
          <Route path="app/banners" element={<Banners />} />
          <Route path="app/redeem" element={<RedeemCode />} />
          <Route path="app/users" element={<AppUsers />} />
          <Route path="app/block" element={<BlockUsers />} />
          <Route path="hotels/register" element={<RegisterHotels />} />
          <Route path="hotels/bookings" element={<Bookings />} />
          <Route path="hotels/status" element={<HotelStatus />} />
          <Route path="analysis" element={<Analysis />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </>
  )
);

export default router;
