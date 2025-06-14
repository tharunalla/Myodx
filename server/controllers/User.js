import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/User.js";
import Diagnosis from "../models/Diagnosis.js";
import crypto from "crypto";
import nodemailer from "nodemailer";


dotenv.config();



export const UserRegister = async (req, res, next) => {
  try {
    const { email, password, name, img } = req.body;

    // Check if the email is in use
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return next(createError(409, "Email is already in use."));
    }

    // ✅ FIXED: await both genSalt and hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      img,
    });

    const createdUser = await user.save();

    const token = jwt.sign({ id: createdUser._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });

    return res.status(200).json({ token, user });
  } catch (error) {
    return next(error);
  }
};

export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    // Check if user exists
    if (!user) {
      return next(createError(404, "User not found"));
    }

    console.log(user); // Logs user details (ensure password is hashed)

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password); // Asynchronous comparison
    if (!isPasswordCorrect) {
      return next(createError(403, "Incorrect password"));
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



export const ForgotPassword = async (req, res, next) => {
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

export const getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const currentDateFormatted = new Date();
    const startToday = new Date(
      currentDateFormatted.getFullYear(),
      currentDateFormatted.getMonth(),
      currentDateFormatted.getDate()
    );
    const endToday = new Date(
      currentDateFormatted.getFullYear(),
      currentDateFormatted.getMonth(),
      currentDateFormatted.getDate() + 1
    );

    //calculte total calories burnt
    const totalCaloriesBurnt = await Workout.aggregate([
      { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
      {
        $group: {
          _id: null,
          totalCaloriesBurnt: { $sum: "$caloriesBurned" },
        },
      },
    ]);

    //Calculate total no of workouts
    const totalWorkouts = await Workout.countDocuments({
      user: userId,
      date: { $gte: startToday, $lt: endToday },
    });

    //Calculate average calories burnt per workout
    const avgCaloriesBurntPerWorkout =
      totalCaloriesBurnt.length > 0
        ? totalCaloriesBurnt[0].totalCaloriesBurnt / totalWorkouts
        : 0;

    // Fetch category of workouts
    const categoryCalories = await Workout.aggregate([
      { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
      {
        $group: {
          _id: "$category",
          totalCaloriesBurnt: { $sum: "$caloriesBurned" },
        },
      },
    ]);

    //Format category data for pie chart

    const pieChartData = categoryCalories.map((category, index) => ({
      id: index,
      value: category.totalCaloriesBurnt,
      label: category._id,
    }));

    const weeks = [];
    const caloriesBurnt = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(
        currentDateFormatted.getTime() - i * 24 * 60 * 60 * 1000
      );
      weeks.push(`${date.getDate()}th`);

      const startOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const endOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1
      );

      const weekData = await Workout.aggregate([
        {
          $match: {
            user: user._id,
            date: { $gte: startOfDay, $lt: endOfDay },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            totalCaloriesBurnt: { $sum: "$caloriesBurned" },
          },
        },
        {
          $sort: { _id: 1 }, // Sort by date in ascending order
        },
      ]);

      caloriesBurnt.push(
        weekData[0]?.totalCaloriesBurnt ? weekData[0]?.totalCaloriesBurnt : 0
      );
    }

    return res.status(200).json({
      totalCaloriesBurnt:
        totalCaloriesBurnt.length > 0
          ? totalCaloriesBurnt[0].totalCaloriesBurnt
          : 0,
      totalWorkouts: totalWorkouts,
      avgCaloriesBurntPerWorkout: avgCaloriesBurntPerWorkout,
      totalWeeksCaloriesBurnt: {
        weeks: weeks,
        caloriesBurned: caloriesBurnt,
      },
      pieChartData: pieChartData,
    });
  } catch (err) {
    next(err);
  }
};



export const addWorkout = async (req, res, next) => {  
  try {  
    console.log('controllers user.js in addworkout with req.body below')
    console.log(req.body);  
    const userId = req.user?.id;  
    const { workoutString } = req.body; 
    
    console.log("Workout String");
    if (!workoutString) {  
      return next(createError(400, "Workout string is missing"));  
    }  
    console.log(workoutString);
    // Split workoutString into lines  
    const eachworkout = workoutString.split(";").map((line) => line.trim());
    console.log("Split workoutString into lines"); 
    console.log(eachworkout); 
    // Check if any workouts start with "#" to indicate categories  
    const categories = eachworkout.filter((line) => line.startsWith("#"));  
    if (categories.length === 0) {  
      return next(createError(400, "No categories found in workout string"));  
    }  
    console.log("Check if any workouts start with # to indicate categories");
    console.log(categories)

    const parsedWorkouts = [];  
    let currentCategory = "";  
    let count = 0;  

    // Loop through each line to parse workout details  
    for (const line of eachworkout) {  
      count++;  
      if (line.startsWith("#")) {  
        const parts = line?.split("\n").map((part) => part.trim());
        console.log("parts in loop");  
        console.log(parts);  
        if (parts.length < 5) {  
          return next(  
            createError(400, `Workout string is missing for ${count}th workout`)  
          );  
        }  

        // Update current category  
        currentCategory = parts[0].substring(1).trim();  
        // Extract workout details  
        const workoutDetails = parseWorkoutLine(parts);  
        console.log("workoutDetails");
        if (workoutDetails == null) {  
          return next(createError(400, "Please enter in proper format "));  
        }  
        console.log(workoutDetails);

        if (workoutDetails) {  
          // Check if the workoutName is duplicate  
          const existingWorkout = await Workout.findOne({  
            user: userId,  
            workoutName: workoutDetails.workoutName,  
          }); 
          console.log('existing workout with user'); 
          console.log(existingWorkout);
          console.log('user');
          console.log(userId);

          if (existingWorkout) {  
            return res.status(400).json({
              message: `Workout "${workoutDetails.workoutName}" already exists.`,
            });
          }  

          // Add category to workout details  
          workoutDetails.category = currentCategory;  
          parsedWorkouts.push(workoutDetails);  
          console.log('pushed to parsedWorkouts');
          console.log(parsedWorkouts);
        }  
      } else {  
        return next(  
          createError(400, `Workout string is missing for ${count}th workout`)  
        );  
      }  
    }  
    console.log('reached at calculate calories');
    console.log(' parsedWorkouts before forloop');
    console.log(parsedWorkouts);
    // Calculate calories burnt for each workout  
    for (const workout of parsedWorkouts) {  
      workout.caloriesBurned = parseFloat(calculateCaloriesBurnt(workout));  
      await Workout.create({ ...workout, user: userId });  
    }  
    console.log('finished calculate calories');
    return res.status(201).json({  
      message: "Workouts added successfully",  
      workouts: parsedWorkouts,  
    });  
  } catch (err) {  
    console.error(err); // Add this line to log the error  
    next(err);  
  }  
};





// Function to parse workout details from a line
const parseWorkoutLine = (parts) => {
  const details = {};
  console.log(parts);
  if (parts.length >= 5) {
    details.workoutName = parts[1].substring(1).trim();
    details.sets = parseInt(parts[2].split("sets")[0].substring(1).trim());
    details.reps = parseInt(
      parts[2].split("sets")[1].split("reps")[0].substring(1).trim()
    );
    details.weight = parseFloat(parts[3].split("kg")[0].substring(1).trim());
    details.duration = parseFloat(parts[4].split("min")[0].substring(1).trim());
    console.log(details);
    return details;
  }
  return null;
};

// Function to calculate calories burnt for a workout
const calculateCaloriesBurnt = (workoutDetails) => {
  const durationInMinutes = parseInt(workoutDetails.duration);
  const weightInKg = parseInt(workoutDetails.weight);
  const caloriesBurntPerMinute = 5; // Sample value, actual calculation may vary
  return durationInMinutes * caloriesBurntPerMinute * weightInKg;
};







export const CheckPresentorNots = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "User ID is required" });
    console.log("Came in controller check present or nto ");
    
    const diagnosisExists = await Diagnosis.exists({ user: userId });
    
    console.log("Came in controller check prese diagnosisExists ",diagnosisExists);
    if (diagnosisExists) {
      return res.status(200).json({ present: true, message: "Diagnosis data found" });
    } else {
      return res.status(200).json({ present: false, message: "No diagnosis data found" });
    }

  } catch (err) {
    next(err);
  }
};