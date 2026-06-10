import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router-dom";

import App from "../src/app";
import ProtectedRoute from "./ProtectedRoute";
import Publicroute from "./Publicroute";

import Login from "../src/pages/Login";
import RegisterHotels from "../src/pages/Hotels/RegisterHotels";
import Bookings from "../src/pages/Hotels/Bookings";
import HotelStatus from "../src/pages/Hotels/HotelStatus";
import Banners from "../src/pages/App/Banners";
import RedeemCode from "../src/pages/App/RedeemCode";
import AppUsers from "../src/pages/App/AppUsers";
import BlockUsers from "../src/pages/App/BlockUsers";
import Analysis from "../src/pages/Analysis";

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
