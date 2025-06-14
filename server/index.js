// import express from "express";
// import * as dotenv from "dotenv";
// import cors from "cors";
// import mongoose from "mongoose";
// import UserRoutes from "./routes/User.js";
// import DiagnosisRoutes from "./routes/diagnosisRoutes.js"
// const { runPythonScript } = require('./routes/modelRoutes');

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true })); // for form data

// app.use("/api/user/", UserRoutes);
// app.use("/api/diagnosis", DiagnosisRoutes);
// app.use("/api/model", ModelRoutes); 

// // error handler
// app.use((err, req, res, next) => {
//   const status = err.status || 500;
//   const message = err.message || "Something went wrong";
//   return res.status(status).json({
//     success: false,
//     status,
//     message,
//   });
// });

// app.get("/", async (req, res) => {
//   res.status(200).json({
//     message: "Hello developers from Team17",
//   });
// });

// const connectDB = () => {
//   mongoose.set("strictQuery", true);
//   mongoose
//     .connect(process.env.MONGODB_URL)
//     .then(() => console.log("Connected to Mongo DB"))
//     .catch((err) => {
//       console.error("failed to connect with mongo");
//       console.error(err);
//     });
// };

// const startServer = async () => {
//   try {
//     connectDB();
//     app.listen(8080, () => console.log("Server started on port 8080"));
//   } catch (error) {
//     console.log(error);
//   }
// };

// startServer();






import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./routes/User.js";
import DiagnosisRoutes from "./routes/diagnosisRoutes.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import ForgotResetRoutes from "./routes/ForgotReset.js";
import FeedbackRoutes from "./routes/FeedbackRoutes.js";
import AdminRoutes from "./routes/AdminRoutes.js";
import FetchDataRoutes from "./routes/FetchDataRoutes.js";
import { runPythonScript } from "./routes/modelRoutes.js";




dotenv.config();

const app = express();
app.use(cors({
  origin: 'https://myo-dx-sde-wdt6.vercel.app',
  credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));



app.use("/api/user/", UserRoutes);
app.use("/api/diagnosis", DiagnosisRoutes);
app.use("/api/forgotreset",ForgotResetRoutes);
app.use("/api/auth",AuthRoutes);
app.use("/api/feedback",FeedbackRoutes);
app.use("/api/admin",AdminRoutes);
app.use("/api/fetch",FetchDataRoutes);

app.post("/api/model/predict", async (req, res) => {
  try {
    const inputData = req.body;
    console.log("REached in index.js inputdata",inputData);
    const prediction = await runPythonScript(inputData);
    res.json(prediction);
  } catch (error) {
    console.error("Prediction error:", error);
    res.status(500).json({ message: error.toString() });
  }
});




app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello From developers from Team17 Munna Prasad , Alla Tharun and Sai Govardhan" });
});

const connectDB = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("Connected to Mongo DB"))
    .catch((err) => {
      console.error("Failed to connect with mongo", err);
    });
};

const startServer = async () => {
  try {
    connectDB();
    app.listen(8080, () => console.log("Server started on port 8080"));
  } catch (error) {
    console.log(error);
  }
};

startServer();

