// routes/diagnosisRoutes.js
import express from "express";
import Diagnosis from "../models/Diagnosis.js";

const router = express.Router();

// Create new diagnosis
router.post("/", async (req, res) => {
  try {
    const newDiagnosis = new Diagnosis(req.body);
    const savedDiagnosis = await newDiagnosis.save();
    res.status(201).json(savedDiagnosis);
  } catch (err) {
    console.error("Error saving diagnosis:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// Get diagnoses - supports optional ?date query
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    let diagnoses;

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      diagnoses = await Diagnosis.find({
        createdAt: { $gte: start, $lte: end }
      }).sort({ createdAt: -1 });
    } else {
      diagnoses = await Diagnosis.find().sort({ createdAt: -1 });
    }

    res.status(200).json(diagnoses);
  } catch (err) {
    console.error("Error fetching diagnoses:", err);
    res.status(500).json({ error: "Server Error" });
  }
});


// Get diagnosis data for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userDiagnoses = await Diagnosis.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(userDiagnoses);
  } catch (err) {
    console.error("Error fetching user's diagnoses:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;


