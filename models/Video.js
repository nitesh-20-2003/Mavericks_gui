import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["happy", "sad", "laugh", "cry", "questioning"],
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  
});

export default mongoose.model("Video", VideoSchema);
