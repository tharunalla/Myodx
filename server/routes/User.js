
import express from "express";
import { UserLogin, UserRegister,ForgotPassword ,CheckPresentorNots} from "../controllers/User.js";
import { verifyToken } from "../middleware/verifyToken.js";
import User from "../models/User.js";

const router = express.Router();

// Route for user signup
router.post("/signup", UserRegister);

// Route for user login
router.post("/signin", UserLogin);
router.post("/presentornot", CheckPresentorNots);


router.post("/forgot-password" , ForgotPassword);

// Protected route to print user info using token
router.get("/me", verifyToken, async (req, res, next) => {
  // console.log("🟢 /me route was called");
  try {
    const user = await User.findById(req.user.id).select("-password"); // exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("Logged-in User Data:", user); // 👈 This prints in the console
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

export default router;
