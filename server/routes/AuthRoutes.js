import express from "express";
import { LoginRoute,SignUpRoute } from "../controllers/AuthControl.js";

const router = express.Router();

router.get("/google/login",LoginRoute);
router.get("/google/signup",SignUpRoute);
export default router;