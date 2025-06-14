import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js"; // make sure you import this


export const resetPass = async (req, res, next) => {
  
    const { token, newPassword } = req.body;
    console.log("Token received:", token);
    console.log("Password received:", newPassword);


    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  
    try {
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ message: "Token is invalid or has expired" });
      }
  
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      console.log("Hashed password:", user.password);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save();
  
      res.status(200).json({
        message: "Password reset successful",
        role: user.role, // Include the user's role in the response
      });
    } catch (error) {
      next(error);
    }

};


export const veriTok = async (req, res, next) => {
    try {
        const resetToken = req.body.token;
        console.log("REached in veriTok for reset ");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Token invalid or expired" });
        }
        console.log("Going to send token valide messagefrom controllers");

        return res.status(200).json({ message: "Token valid" });
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(500).json({ message: "Server error. Please try again later." });
    }
};
