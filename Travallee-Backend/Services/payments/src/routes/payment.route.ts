import express from "express";
import { initiatePayment, esewaCallback, khaltiCallback, esewaFormPage } from "../controllers/payment.controller";

const router = express.Router();

router.post("/initiate",       initiatePayment);
router.get("/esewa/form",      esewaFormPage);
router.get("/esewa/callback",  esewaCallback);
router.post("/esewa/callback", esewaCallback);  
router.get("/khalti/callback", khaltiCallback);
router.post("/khalti/callback", khaltiCallback);

export default router;