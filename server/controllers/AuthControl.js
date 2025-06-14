import axios from 'axios';
import dotenv from 'dotenv';
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import createError from "http-errors";
 import bcrypt from "bcryptjs";

dotenv.config(); // Make sure you load environment variables

export const LoginRoute = async (req, res, next) => {
  try {
    const code = req.query.code;
    // console.log("Code received from Google:", code);

    // Google OAuth Token URL
    const tokenUrl = 'https://oauth2.googleapis.com/token';

    // Prepare data for the POST request (no redirect_uri here)
    const data = {
      code: code,
      client_id: process.env.GOOGLE_CLIENT_ID, // from your .env
      client_secret: process.env.GOOGLE_CLIENT_SECRET, // from your .env
      redirect_uri: 'postmessage',
      grant_type: 'authorization_code',
    };

    // Make the POST request to exchange the code for an access token
    const response = await axios.post(tokenUrl, new URLSearchParams(data));

    // Log the response to see what you get
    // console.log('Google Token Response:', response.data);

    // Extract access_token and id_token from the response
    const { access_token, id_token } = response.data;
    

    // You can now use the access token to access Google APIs or user info
    const userInfoRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const googleUser = userInfoRes.data;
    console.log("Google User Info:", googleUser);

    // Check if user already exists
    let user = await User.findOne({ email: googleUser.email }).exec();
    console.log(user);
    if (!user) {
      // If user does not exist, create a new one
      const dummyPassword = googleUser.sub + process.env.JWT_SECRET;
      const hashedPassword = await bcrypt.hash(dummyPassword, 10);

      user = new User({
        name: googleUser.name,
        email: googleUser.email,
        password: hashedPassword, // hashed dummy password
        googleId: googleUser.sub,
        img: googleUser.picture,
        isGoogleUser: true,
      });

      user = await user.save();
      console.log("New Google user signed up:", user);
    } else {
      console.log("Existing Google user logged in:", user);
    }

    console.log("going to create token");
    // Generate token for either existing or newly created user
    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      message: user.wasNew ? 'User created and authenticated' : 'User authenticated',
      token,
      user,
    });

  } catch (error) {
    // console.error("Error during Google Auth:", error);
    return next(error); // Pass the error to error-handling middleware
  }
};







export const SignUpRoute = async (req, res, next) => {
  try {
    const code = req.query.code;
    // console.log("Code received from Google:", code);

    const tokenUrl = 'https://oauth2.googleapis.com/token';

    const data = {
      code: code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: 'postmessage',
      grant_type: 'authorization_code',
    };

    const response = await axios.post(tokenUrl, new URLSearchParams(data));
    // console.log('Google Token Response:', response.data);

    const { access_token } = response.data;

    if (!access_token) {
      return next(createError(400, "Failed to obtain access token"));
    }

    const userInfoRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const googleUser = userInfoRes.data;
    // console.log("Google User Info:", googleUser);

    let user = await User.findOne({ email: googleUser.email }).exec();

    if (!user) {
      // Generate dummy password
      const dummyPassword = googleUser.sub + process.env.JWT_SECRET;
      const hashedPassword = await bcrypt.hash(dummyPassword, 10);

      // Create new user
      user = new User({
        name: googleUser.name,
        email: googleUser.email,
        password: hashedPassword,
        googleId: googleUser.sub,
        img: googleUser.picture,
        isGoogleUser: true,
      });

      user = await user.save();
      // console.log("New user created:", user);
    } else {
      // console.log("Existing user:", user);
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: '1d' });

    return res.status(200).json({
      message: 'User authenticated',
      token,
      user,
    });

  } catch (error) {
    // console.error("Google Auth error:", error);
    return next(createError(500, "Error during Google authentication"));
  }
};

