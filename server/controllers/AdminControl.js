import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/User.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import axios from "axios";


dotenv.config();


export const AdminUserRegister = async (req, res, next) => {
  try {
    const { name, email, password, secret, img } = req.body;

    // Check if the secret matches the environment variable
    if (secret !== process.env.ADMIN_SECRET) {
      return next(createError(403, "Unauthorized: Invalid secret key."));
    }

    // Check if the email is in use
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return next(createError(409, "Email is already in use."));
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Set the role to "admin" since the secret is valid
    const user = new User({
      name,
      email,
      password: hashedPassword,
      img,
      role: "admin",  // set role to admin for admin users
    });

    const createdUser = await user.save();

    // Generate a JWT token
    const token = jwt.sign({ id: createdUser._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });

    return res.status(200).json({ token, user });
  } catch (error) {
    return next(error);
  }
};


export const AdminUserLogin = async (req, res, next) => {
    try {
      const { email, password, secret } = req.body;
  
      // Check if the admin secret is provided
      if (!secret) {
        return next(createError(400, "Admin secret is required"));
      }
  
      // Verify the admin secret
      if (secret !== process.env.ADMIN_SECRET) {
        return next(createError(403, "Invalid admin secret"));
      }
  
      const user = await User.findOne({ email: email });
      // Check if user exists
      if (!user) {
        return res.status(404).json({ message: "User not found, redirecting to sign-up", redirectToSignUp: true });
      }
  
      console.log(user); // Logs user details (ensure password is hashed)

      // Check if the user role is admin
    if (user.role !== 'admin') {
      return next(createError(422, "You must be an admin to log in"));
    }
  
      // Check if password is correct
      const isPasswordCorrect = await bcrypt.compare(password, user.password); // Asynchronous comparison
      if (!isPasswordCorrect) {
        return next(createError(401, "Incorrect password"));
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT, {
        expiresIn: "9999 years",
      });
  
      console.log("Token generated:", token); // Log token for debugging
  
      return res.status(200).json({ token, user }); // Send token and user data back
    } catch (error) {
      console.error(error); // Log any errors to the console
      return next(error); // Pass the error to error-handling middleware
    }
  };
  



export const AdminForgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save hashed token and expiration in DB
    const hash = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordToken = hash;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    // Construct reset URL
    // const resetUrl = `http://localhost:3000/reset-password/${resetToken}`; // adjust as needed
    const resetUrl = `https://myo-dx-sde-wdt6.vercel.app/reset-password/${resetToken}`;


    // Send email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // TLS
      secure: false,
      auth: {
        user: "munnarauniyar789@gmail.com",
        pass: "iovo rhns mzan kwpu", // ← paste app password here
      },
    });

    const mailOptions = {
      from: '"MD Diagnosis" <munnarauniyar789@gmail.com>',
      to: user.email,
      subject: "Password Reset Link",
      html: `
        <h3>Hello ${user.name},</h3>
        <p>You requested a password reset. Click the link below:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you didn’t request this, ignore this email.</p>
      `
    };
    
    console.log("📧 Preparing to send email...");
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");


    return res.status(200).json({ message: "Reset email sent" });
  } catch (error) {
    console.error("Error in ForgotPassword:", error); // Add this
    return next(error);
  }
};




export const AdminGoogleSignUp = async (req, res, next) => {
  try {
    console.log("Reached in backend post admin control googlesingup");
    const { code, secret } = req.body;
    console.log("Reached in backend post code is ",code , " secret is ",secret);

    if (!code || !secret) {
      return next(createError(400, "Code and secret are required"));
    }

    if (secret !== process.env.ADMIN_SECRET) {
      return next(createError(403, "Invalid admin secret"));
    }

    const tokenUrl = 'https://oauth2.googleapis.com/token';

    const tokenData = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: 'postmessage',
      grant_type: 'authorization_code',
    };

    let tokenResponse;
    try {
      tokenResponse = await axios.post(tokenUrl, new URLSearchParams(tokenData));
    } catch (tokenError) {
      console.error("Error fetching access token from Google:", tokenError.response?.data || tokenError.message);
      return next(createError(400, "Failed to exchange code for access token"));
    }

    const { access_token } = tokenResponse.data;
    console.log("got access_tokenn " , access_token);

    if (!access_token) {
      return next(createError(400, "No access token received from Google"));
    }

    let userInfoResponse;
    try {
      userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
    } catch (userInfoError) {
      console.error("Error fetching user info from Google:", userInfoError.response?.data || userInfoError.message);
      return next(createError(400, "Failed to fetch user info from Google"));
    }

    const googleUser = userInfoResponse.data;

    if (!googleUser || !googleUser.email) {
      return next(createError(400, "Incomplete user info received from Google"));
    }

    let user = await User.findOne({ email: googleUser.email }).exec();

    if (!user) {
      const dummyPassword = googleUser.sub + process.env.JWT_SECRET;
      const hashedPassword = await bcrypt.hash(dummyPassword, 10);

      user = new User({
        name: googleUser.name,
        email: googleUser.email,
        password: hashedPassword,
        googleId: googleUser.sub,
        img: googleUser.picture,
        role: "admin",
        isGoogleUser: true,
      });

      await user.save();
      console.log("New Admin created:", user.email);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: '1d' });

    return res.status(200).json({
      message: 'User authenticated successfully',
      token,
      user,
    });

  } catch (error) {
    console.error("Unexpected server error during Google SignUp:", error);
    return next(createError(500, "Internal server error during Google authentication"));
  }
};

