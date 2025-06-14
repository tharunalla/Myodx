import express from "express";
import {FetchDataStats,FetchDataUsers,PostEditedData,DeleteData,FetchUserReport} from "../controllers/FetchDataControl.js";


const router = express.Router();

router.get('/data/stats',FetchDataStats);
router.get('/data/users',FetchDataUsers);
router.post('/post/data/users',PostEditedData);
router.post('/delete/data/users',DeleteData);
router.post('/report/data/users',FetchUserReport);

export default router;