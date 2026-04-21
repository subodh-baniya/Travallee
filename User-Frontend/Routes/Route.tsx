import {createBrowserRouter, createRoutesFromElements, Route, Navigate} from "react-router-dom"
import InitialHome from "../Pages/InitialHome"
import AboutUs from "../Pages/AboutUs"
import Services from "../Pages/Services"
import ContactUs from "../Pages/ContactUs"
import Herosection from "../Components/Herosection"
import Register from "../Pages/Register"
import Loginpage from "../Pages/Loginpage"
import Dashboard from "../Pages/Dashboard"
import ProtectedRoute from "./ProtectedRoute"
import Publicroute from "./Publicroute"
import Overview from "../Pages/Overview"
import Bookings from "../Pages/Bookings"
import Rooms from "../Pages/Rooms"
import Pricing from "../Pages/Pricing"
import Guests from "../Pages/Guests"
import Payments from "../Pages/Payments"
import Reports from "../Pages/Reports"
import Settings from "../Pages/Settings" 

const router=createBrowserRouter(
    createRoutesFromElements(
        <>
        <Route element={<Publicroute/>}>
        <Route path="/login"element={<Loginpage/>}/>
        <Route path="/register" element={<Register/>}/>

        <Route path="/" element={<Navigate to="/initialhome/herosection" replace/>}/>
        <Route path="/initialhome"element={<InitialHome/>}>
        <Route path="herosection" element={<Herosection/>}/>
        <Route path="aboutus" element={<AboutUs/>}/>
        <Route path="services" element={<Services/>}/>
        <Route path="contactus" element={<ContactUs/>}/>
        </Route>
        </Route>

          <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>

          <Route index element={<Overview/>} />
          <Route path="bookings" element={<Bookings/>} />
          <Route path="rooms" element={<Rooms/>} />
          <Route path="pricing" element={<Pricing/>} />
          <Route path="guests" element={<Guests/>} />
          <Route path="payments" element={<Payments/>} />
          <Route path="reports" element={<Reports/>} />
          <Route path="settings" element={<Settings/>} />

        </Route>
      </Route>
        
        </>
    )
)

export default router