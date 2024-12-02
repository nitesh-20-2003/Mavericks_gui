import express from "express";
import { 
  uploadMiddleware, 
  uploadVideo, 
  getVideosByExpression, 
  getAllVideos, 
  deleteVideo 
} from "../controllers/videoController.js";

const router = express.Router();

// Route to upload a video
router.post("/upload", uploadMiddleware, uploadVideo);

// Route to get videos by expression
router.get("/expressions/:expression", getVideosByExpression);

// Other routes (e.g., get all videos, delete video)
router.get("/", getAllVideos);
router.delete("/:id", deleteVideo);

export default router;
