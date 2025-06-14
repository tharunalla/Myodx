import mongoose from "mongoose";

// Define the Stats Schema
const statsSchema = new mongoose.Schema({
  users: {
    type: Number,
    required: true,  // Ensures users count is required
    default: 0,  // Default value for users if not provided
  },
  feedback: {
    type: Number,
    required: true,  // Ensures feedback count is required
    default: 0,  // Default value for feedback if not provided
  },
  createdAt: {
    type: Date,
    default: Date.now,  // Automatically set current date/time when record is created
  },
});

// Create a model from the schema
export default  mongoose.model("Stats", statsSchema);
