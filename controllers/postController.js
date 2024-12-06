import Post from '../models/Post.js';
import jwt from 'jsonwebtoken'; // Importing jwt for token verification
import dotenv from 'dotenv';
import { StatusCodes } from 'http-status-codes';

dotenv.config();


// Fetch all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find(); // No need to populate now since username is stored in Post directly
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts', error: err.message });
  }
};

// Add a new post
export const addPost = async (req, res) => {
    const { title, content } = req.body;
  
    const username = req.user?.username; // Extract the username from the token
    if (!username) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Username is missing in the token" });
    }
  
    // Validation checks
    if (!title || !content) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Both title and content are required" });
    }
  
    try {
      // Create a new post with the provided data and the username from the token
      const post = new Post({ title, content, username });
      await post.save();
  
      res.status(StatusCodes.CREATED).json({ message: 'Post added successfully', post });
    } catch (err) {
      console.error("Error adding post:", err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error adding post', error: err.message });
    }
  };
  
// Like a post
export const likePost = async (req, res) => {
    const { postId } = req.body;
  
    try {
      console.log("Received postId:", postId);
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      // Increment the likes count
      post.likes += 1;
  
      // Only update the likes field
      await post.updateOne({ likes: post.likes });
  
      res.status(200).json({ message: "Post liked successfully", post });
    } catch (err) {
      console.error("Error liking post:", err);
      res.status(500).json({ message: "Error liking post", error: err.message });
    }
  };

  // Comment on a post
  // In your Post Controller (for example: postController.js)
  export const addComment = async (req, res) => {
    try {
      const { postId, content } = req.body;
  
      // Get the username from the token
      const username = req.user?.username; 
  
      if (!username) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid token or missing username' });
      }
  
      // Validate the postId
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Create a new comment object
      const comment = {
        content,
        username, // Save the username of the commenter
        createdAt: new Date(),
      };
  
      // Add the comment to the post
      post.comments.push(comment);
  
      // Save the updated post
      await post.updateOne({ comments: post.comments });
  
      // Return the updated post with the new comment
      res.status(200).json({ post });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ message: 'Failed to add comment' });
    }
  };

  // Delete a post
export const deletePost = async (req, res) => {
    const { postId } = req.params;
  
    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      // Delete the post
      await post.deleteOne();
  
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
      console.error("Error deleting post:", err);
      res.status(500).json({ message: "Error deleting post", error: err.message });
    }
  };
  
  // Delete a comment
  export const deleteComment = async (req, res) => {
    const { postId, commentId } = req.params;
  
    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      const commentIndex = post.comments.findIndex((comment) => comment._id.toString() === commentId);
      if (commentIndex === -1) {
        return res.status(404).json({ message: "Comment not found" });
      }
  
      // Remove the comment
      post.comments.splice(commentIndex, 1);
  
      // Save the post with the updated comments array
      await post.save();
  
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
      console.error("Error deleting comment:", err);
      res.status(500).json({ message: "Error deleting comment", error: err.message });
    }
  };
  