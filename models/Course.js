// models/Course.js
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  playlistUrl: { type: String, required: true },
  thumbnail: { type: String, required: true }
});

export default mongoose.model("Course", courseSchema);
