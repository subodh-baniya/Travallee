import { Router } from "express";
import {registerHotel , createroom ,deleteRoom , featuredHotels} from "../controller/register.controller.js";



const router = Router();

router.post("/register", registerHotel);
router.post("/room/:hotelId", createroom);
router.delete("/room/:hotelId/:roomId",deleteRoom); 
router.get("/featured", featuredHotels); 



export default router;