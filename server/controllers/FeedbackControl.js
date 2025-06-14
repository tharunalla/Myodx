import Feedback from '../models/FeedbackModel.js';
import mongoose from 'mongoose';

// GET feedback status
export const FeedbackControl = async (req, res, next) => {
  try {
    const  userId  = req.params.userId;
    console.log(userId);
  
    const record = await Feedback.findOne({ userId });
    console.log("in feedback control",record);
    return res.status(200).json({ hasGivenFeedback: record?.hasGivenFeedback || false });
  } catch (err) {
    console.error("Error in FeedbackControl:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// POST submit feedback
export const SubmitFeedback = async (req, res, next) => {
  try {
    const { userId, feedback } = req.body;

    const updatedFeedback = await Feedback.findOneAndUpdate(
      { userId },
      {
        hasGivenFeedback: true,
        feedback: {
          satisfaction: feedback.satisfaction,
          easeOfUse: feedback.easeOfUse,
          clarity: feedback.clarity,
          helpfulness: feedback.helpfulness,
          suggestions: feedback.suggestions
        }
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Feedback received in SubmitFeedback from ${userId}:`, feedback);

    // Always send a success response properly
    return res.status(200).json({ message: "Feedback submitted successfully", hasGivenFeedback: true });
  } catch (err) {
    console.error("Error in SubmitFeedback:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};





