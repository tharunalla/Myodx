import User from '../models/User.js';
import Feedback from '../models/FeedbackModel.js';
import Diagnosis from '../models/Diagnosis.js';

export const FetchDataStats = async (req, res) => {
  try {
    console.log("Came in FetchDataControl.js");

    const usersCount = await User.countDocuments();
    const feedbackCount = await Feedback.countDocuments();
    const diagnosisCount = await Diagnosis.countDocuments();

    // Dates for weekly analysis
    const today = new Date();
    const pastFourWeeks = [];

    for (let i = 3; i >= 0; i--) {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() - (i * 7));
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      pastFourWeeks.push({ start: startOfWeek, end: endOfWeek });
    }

    // Get weekly user counts
    const userGrowth = await Promise.all(
      pastFourWeeks.map(async ({ start, end }) => {
        const count = await User.countDocuments({
          createdAt: { $gte: start, $lte: end },
        });
        return count;
      })
    );

    // New users this week
    const { start: startOfThisWeek, end: endOfThisWeek } = pastFourWeeks[3];
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: startOfThisWeek, $lte: endOfThisWeek },
    });

    // Fetch recent feedbacks with feedback giver's name
    const recentFeedbacks = await Feedback.find({})
      .sort({ createdAt: -1 })
      .limit(4)
      .select('feedback.satisfaction feedback.easeOfUse feedback.clarity feedback.helpfulness feedback.suggestions userId') // Include userId to fetch the name
      .populate('userId', 'name'); // Populate the name from the User model

      // console.log(recentFeedbacks);

    res.status(200).json({
      users: usersCount,
      feedback: feedbackCount,
      diagnoses: diagnosisCount,
      newUsersThisWeek,
      userGrowth,
      recentFeedbacks: recentFeedbacks.map(fb => ({
        satisfaction: fb.feedback.satisfaction,
        easeOfUse: fb.feedback.easeOfUse,
        clarity: fb.feedback.clarity,
        helpfulness: fb.feedback.helpfulness,
        suggestions: fb.feedback.suggestions,
        feedbackGiverName: fb.userId ? fb.userId.name : 'Unknown' // Safely adding the feedback giver's name
      }))
    });
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



export const FetchDataUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();

    // Return the users data
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



export const PostEditedData = async (req, res) => {
  try {
    const { userId, formData } = req.body;

    console.log("Received data:", userId, formData);

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: formData },
      { new: true } // return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const DeleteData = async (req, res) => {
  try {
    const {userId} = req.body;
    console.log("REached in delete backend ",userId);
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const FetchUserReport = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("Reached in FetchUserReport backend, userId:", userId);

    // Fetch the user details from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the latest diagnosis report for this user (all fields)
    const latestDiagnosis = await Diagnosis.findOne({ user: userId })
      .sort({ createdAt: -1 }) // Sort by createdAt to get the latest diagnosis
      .exec();

    // Fetch the latest feedback for this user
    const latestFeedback = await Feedback.findOne({ userId })
      .sort({ createdAt: -1 }) // Sort by createdAt to get the latest feedback
      .exec();

    // Combine all data into the report object
    const report = {
      user: {
        name: user.name,
        email: user.email,
        age: user.age,
        role: user.role,
        img: user.img,
      },
      latestDiagnosis: latestDiagnosis
        ? latestDiagnosis // Includes all fields from the latest diagnosis
        : null,  // If no diagnosis is found, return null
      latestFeedback: latestFeedback
        ? {
            satisfaction: latestFeedback.feedback.satisfaction,
            easeOfUse: latestFeedback.feedback.easeOfUse,
            clarity: latestFeedback.feedback.clarity,
            helpfulness: latestFeedback.feedback.helpfulness,
            suggestions: latestFeedback.feedback.suggestions,
          }
        : null,  // If no feedback is found, return null
    };

      console.log(report);
    // Send the report response
    return res.status(200).json({ report });

  } catch (error) {
    console.error("Error fetching user report:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


