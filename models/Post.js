import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
    {
      title: { type: String, required: true },
      content: { type: String, required: true },
      username: { type: String, required: true },
      likes: { type: Number, default: 0 },
      comments: [
        {
          username: { type: String, required: true },
          content: { type: String, required: true },
          createdAt: { type: Date, default: Date.now },
        },
      ], // Array of comments
    },
    { timestamps: true }
  );
  
  const Post = mongoose.model('Post', PostSchema);
  export default Post;
  