import Router from "express"
import { esewaSuccess,createBooking, } from "../controller/booking.controller.js";
import { authenticate } from "../middleware/role.middleware.js";

const router = Router();


router.post("/esewa/success", esewaSuccess)


router.post("/create-booking", authenticate,createBooking)


export default router