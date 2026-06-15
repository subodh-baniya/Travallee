import express from "express";
import { initiatePayment, esewaCallback, khaltiCallback } from "../controllers/payment.controller";

const router = express.Router();

router.post("/initiate",       initiatePayment);
router.get("/esewa/callback",  esewaCallback);
router.get("/khalti/callback", khaltiCallback);

export default router;