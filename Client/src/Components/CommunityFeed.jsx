import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAlert } from 'react-alert';
import defaultProfilePic from '../assets/images/Sample_User_Image.png';

const CommunityFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [newComment, setNewComment] = useState({ postId: '', content: '' });
  const [visibleComments, setVisibleComments] = useState({});

  const alert = useAlert();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User is not authenticated.');
        setLoading(false);
        return;
      }

      const response = await axios.get('/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to fetch posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.post('/api/posts/like', { postId });
      const updatedPost = response.data.post;
      setPosts(posts.map((post) => (post._id === postId ? updatedPost : post)));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert.error('Title and content cannot be empty.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/posts', newPost, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts([response.data.post, ...posts]);
      setNewPost({ title: '', content: '' });
      alert.success('Post added successfully!');
    } catch (err) {
      console.error('Error adding post:', err);
      alert.error('Failed to add post.');
    }
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    if (!newComment.content.trim()) {
      alert.error('Comment cannot be empty.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/posts/comment',
        { postId, content: newComment.content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedPost = response.data.post;
      setPosts(posts.map((post) => (post._id === postId ? updatedPost : post)));
      setNewComment({ postId: '', content: '' });
      alert.success('Comment added successfully!');
    } catch (err) {
      console.error('Error adding comment:', err);
      alert.error('Failed to add comment.');
    }
  };

  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post._id !== postId));
      alert.success('Post deleted successfully!');
    } catch (err) {
      console.error('Error deleting post:', err);
      alert.error('Failed to delete the post.');
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this comment?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`/api/posts/${postId}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedPost = response.data.post;
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );

      alert.success('Comment deleted successfully!');
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert.error('Failed to delete the comment.');
    }
  };

  const toggleCommentsVisibility = (postId) => {
    setVisibleComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-blue-50">
        <div className="text-xl font-bold text-blue-700">Loading posts...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-blue-50">
        <div className="text-red-600 font-semibold">{error}</div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-blue-50 min-h-screen space-y-6">
      {posts.length === 0 ? (
        <p className="text-gray-600 text-center">No discussions available.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition-all border border-blue-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={defaultProfilePic}
                    alt="Profile"
                    className="w-12 h-12 rounded-full border-2 border-blue-500"
                  />
                  <p className="text-sm text-blue-800 font-semibold">{post.username || 'Anonymous'}</p>
                </div>
                <button
                  onClick={() => handleDeletePost(post._id)}
                  className="bg-red-600 text-white text-xs px-3 py-1 rounded-md shadow hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300"
                >
                  Delete
                </button>
              </div>
              <h3 className="text-2xl font-bold text-blue-700 mt-3">{post.title}</h3>
              <p className="text-gray-800 mt-2">{post.content}</p>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => handleLike(post._id)}
                  className="btn btn-outline btn-sm border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  Like ({post.likes})
                </button>
                <span className="text-sm text-gray-500">
                  Posted on {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => toggleCommentsVisibility(post._id)}
                  className="text-sm text-blue-600 hover:underline focus:outline-none"
                >
                  {visibleComments[post._id] ? 'Hide comments' : 'Show comments'}
                </button>
                {visibleComments[post._id] && (
                  <div className="mt-4">
                    {post.comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <img
                              src={defaultProfilePic}
                              alt="Profile"
                              className="w-8 h-8 rounded-full border-2 border-blue-300"
                            />
                            <p className="text-sm text-blue-600">{comment.username || 'Anonymous'}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteComment(post._id, comment._id)}
                            className="bg-red-600 text-white text-xs px-3 py-1 rounded-md shadow hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300"
                          >
                            Delete
                          </button>
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-6">
                <textarea
                  placeholder="Add a comment..."
                  value={newComment.content}
                  onChange={(e) => setNewComment({ ...newComment, content: e.target.value, postId: post._id })}
                  className="textarea textarea-bordered w-full border-blue-300"
                  rows="3"
                ></textarea>
                <button
                  onClick={(e) => handleAddComment(e, post._id)}
                  className="btn btn-primary btn-sm mt-2"
                >
                  Add Comment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;
