import Router from "express"
import { esewaSuccess,createBooking } from "../controller/booking.controller.js";

const router=Router();

router.route("/create_booking").post(createBooking)

router.route("/esewasuccess").post(esewaSuccess)

export default router