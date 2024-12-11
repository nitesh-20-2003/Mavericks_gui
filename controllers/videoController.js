import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import Video from "../models/Video.js";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

dotenv.config();

// Debugging Cloudinary configuration
// console.log("Cloudinary Config:");
// console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("API Key:", process.env.CLOUDINARY_API_KEY);
// console.log("API Secret:", process.env.CLOUDINARY_API_SECRET);

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

// Upload Video Handler
export const uploadVideo = async (req, res) => {
  const { title, description, category } = req.body;

  const username = req.user?.username;
  if (!username) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Username is missing in the token" });
  }

  if (!req.file || !title || !description || !category) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields and a video file are required" });
  }

  const validCategories = ["happy", "sad", "surprise", "neutral", "anger"];
  if (!validCategories.includes(category)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid category" });
  }

  try {
    const folderPath = `videos/uploads/${category}`;
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: folderPath,
    });

    const video = new Video({
      title,
      description,
      url: result.secure_url,
      public_id: result.public_id,
      category,
      username,
    });

    await video.save();
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Video uploaded successfully", video });
  } catch (error) {
    console.error("Error uploading video:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(`{ message: Failed to upload video: ${error.message} }`);
  }
};

// Fetch All Videos Handler
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    const availableVideos = [];

    for (const video of videos) {
      try {
        console.log("Checking video existence:", video.public_id);
        await cloudinary.api.resource(video.public_id, {
          resource_type: "video",
        });
        availableVideos.push(video);
      } catch (error) {
        if (error.http_code === 404) {
          console.warn(`Video not found on Cloudinary: ${video.public_id}`);
        } else {
          console.error(
            `Error checking video ${video.public_id}:, error.message`
          );
        }
      }
    }

    res.status(StatusCodes.OK).json(availableVideos);
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(`{ message: Failed to fetch videos: ${error.message} }`);
  }
};
