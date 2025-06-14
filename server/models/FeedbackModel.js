


import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: 'User', // Refers to the User model
      required: true 
    },
    hasGivenFeedback: { 
      type: Boolean, 
      default: false 
    },
    feedback: {  // ✅ Feedback object with satisfaction, easeOfUse, etc.
      satisfaction: { type: String, default: "" },
      easeOfUse: { type: String, default: "" },
      clarity: { type: String, default: "" },
      helpfulness: { type: String, default: "" },
      suggestions: { type: String, default: "" }
    }
  },
  { timestamps: true } // Optional: to keep track of created and updated times
);

export default mongoose.model("Feedback", FeedbackSchema);
