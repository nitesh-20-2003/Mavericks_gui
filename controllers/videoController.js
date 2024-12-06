import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import Video from "../models/Video.js";
import jwt from "jsonwebtoken"; // Importing jwt for token verification
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer
const storage = multer.diskStorage({});
const upload = multer({ storage });
export const uploadMiddleware = upload.single("file");


// Upload Video
export const uploadVideo = async (req, res) => {
  const { title, description, category } = req.body;
  const username = req.user?.username; // Extract the username from the token

  if (!username) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Username is missing in the token" });
  }

  // Validation checks
  if (!req.file) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "No video file uploaded" });
  }

  if (!title || !description || !category) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "All fields (title, description, category) are required" });
  }

  const validCategories = ["happy", "sad", "laugh", "cry", "questioning"];
  if (!validCategories.includes(category)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid category" });
  }

  try {
    // Upload video to Cloudinary
    const folderPath = `videos/uploads/${category}`;
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: folderPath,
    });

    // Save video data to the database
    const video = new Video({
      title,
      description,
      url: result.secure_url,
      public_id: result.public_id,
      category,
      username, // Using the username from the token
    });

    await video.save();
    res.status(StatusCodes.CREATED).json({ message: "Video uploaded successfully", video });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Failed to upload video: ${error.message}` });
  }
};

// Fetch All Videos
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    const availableVideos = [];

    for (const video of videos) {
      try {
        // Verify the video exists on Cloudinary
        await cloudinary.api.resource(video.public_id, { resource_type: "video" });
        availableVideos.push(video);
      } catch (error) {
        if (error.http_code !== 404) {
          console.error(`Error checking video ${video.public_id}:`, error);
        }
        // Skip if the video doesn't exist on Cloudinary
      }
    }

    res.status(200).json(availableVideos);
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    res.status(500).json({ message: `Failed to fetch videos: ${error.message}` });
  }
};

