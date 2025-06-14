import express from "express";
import {resetPass,veriTok} from  "../controllers/ForgotReset.js";

const router = express.Router();

// Route for user signup
router.post("/reset-password", resetPass);

// Route for user login
router.post("/verifyToken", veriTok);

export default router;