import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import Video from "../models/Video.js";

// Configure Cloudinary (ensure your Cloudinary keys are correct)
cloudinary.config({
  cloud_name: "dl1tgeiir", // Replace with your Cloudinary cloud name
  api_key: "988369427315349", // Replace with your Cloudinary API key
  api_secret: "5O9J8VhRJdp9ZXOZJ2QX_pRiNuM", // Replace with your Cloudinary API secret
});

// Configure Multer
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Middleware for uploading files
export const uploadMiddleware = upload.single("file");

// Upload Video to Cloudinary
export const uploadVideo = async (req, res) => {
  const { title, description, category } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No video file uploaded" });
  }

  if (!category) {
    return res.status(400).json({ message: "Category (expression type) is required" });
  }

  // Define valid categories
  const validCategories = ["happy", "sad", "laugh", "cry", "questioning"];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ message: "Invalid category" });
  }

  try {
    // Dynamically set the folder path
    const folderPath = `videos/uploads/${category}`;

    // Upload the video to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: folderPath,
    });

    // Save video details in MongoDB
    const video = new Video({
      title,
      description,
      url: result.secure_url,
      public_id: result.public_id,
      category,
    });

    await video.save();
    res.status(201).json({ message: "Video uploaded successfully", video });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ message: `Failed to upload video: ${error.message}` });
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

// Fetch Videos by Expression (category)
export const getVideosByExpression = async (req, res) => {
  const { expression } = req.params;

  // Validate if the expression is one of the accepted types
  const validExpressions = ["happy", "sad", "laugh", "cry", "questioning"];
  if (!validExpressions.includes(expression)) {
    return res.status(400).json({ message: "Invalid expression type" });
  }

  try {
    const videos = await Video.find({ category: expression });

    if (!videos.length) {
      return res.status(404).json({ message: `No videos found for ${expression}` });
    }

    res.status(200).json(videos);
  } catch (error) {
    console.error("Failed to fetch videos by expression:", error);
    res.status(500).json({ message: `Failed to fetch videos: ${error.message}` });
  }
};

// Delete Video
export const deleteVideo = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the video by ID in the database
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Delete video from Cloudinary
    await cloudinary.uploader.destroy(video.public_id, { resource_type: "video" });

    // Delete video from the database
    await video.deleteOne();

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ message: `Failed to delete video: ${error.message}` });
  }
};
