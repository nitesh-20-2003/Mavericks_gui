import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const { userId } = useParams(); // Get userId from URL
  const [user, setUser] = useState(null); // User details
  const [videos, setVideos] = useState([]); // User's uploaded videos (initialize as an empty array)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch user details
        const userResponse = await axios.get(`/api/users/${userId}`);
        setUser(userResponse.data);

        // Fetch user videos
        const videosResponse = await axios.get(`/api/users/${userId}/videos`);
        // Check if videosResponse.data is an array, set it to an empty array if not
        setVideos(Array.isArray(videosResponse.data) ? videosResponse.data : []);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      {/* User Profile Info */}
      <div style={styles.profileInfo}>
        <h1 style={styles.username}>{user.username}</h1>
        <p style={styles.email}>Email: {user.email}</p>
        <p style={styles.joined}>Joined: {new Date(user.joinedAt).toLocaleDateString()}</p>
      </div>

      {/* Uploaded Videos */}
      <div>
        <h2 style={styles.videosHeading}>Uploaded Videos</h2>
        {videos.length > 0 ? (
          <div style={styles.videosGrid}>
            {videos.map((video) => (
              <div key={video._id} style={styles.videoCard}>
                <h3 style={styles.videoTitle}>{video.title}</h3>
                <p style={styles.videoDescription}>{video.description}</p>
                <video src={video.url} controls style={styles.videoPlayer}></video>
              </div>
            ))}
          </div>
        ) : (
          <p style={styles.noVideos}>No videos uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    lineHeight: "1.6",
    color: "#333",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
    color: "#555",
  },
  profileInfo: {
    marginBottom: "30px",
    borderBottom: "2px solid #ddd",
    paddingBottom: "20px",
  },
  username: {
    fontSize: "32px",
    fontWeight: "bold",
    margin: "0 0 10px",
    color: "#444",
  },
  email: {
    fontSize: "18px",
    margin: "5px 0",
    color: "#666",
  },
  joined: {
    fontSize: "16px",
    margin: "5px 0",
    color: "#777",
  },
  videosHeading: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
  },
  videosGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  videoCard: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s",
  },
  videoTitle: {
    fontSize: "20px",
    margin: "0 0 10px",
    color: "#222",
  },
  videoDescription: {
    fontSize: "16px",
    margin: "0 0 15px",
    color: "#555",
  },
  videoPlayer: {
    width: "100%",
    borderRadius: "5px",
  },
  noVideos: {
    fontSize: "18px",
    color: "#777",
    textAlign: "center",
    marginTop: "20px",
  },
};

export default ProfilePage;
