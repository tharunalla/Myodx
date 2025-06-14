import express from "express";
import {FeedbackControl,SubmitFeedback} from "../controllers/FeedbackControl.js"

const router = express.Router();


router.get('/reached/:userId', FeedbackControl);       // check feedback status
router.post('/submit', SubmitFeedback);  


export default router;