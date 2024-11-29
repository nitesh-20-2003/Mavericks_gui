import React, { useEffect, useState } from "react";

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "happy", "sad", "laugh", "cry", "questioning"];

  const fetchVideos = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/videos");
      if (!response.ok) {
        throw new Error(`Failed to fetch videos: ${response.statusText}`);
      }

      const fetchedVideos = await response.json();
      const cachedVideos = localStorage.getItem("videos");
      let parsedCachedVideos = [];

      if (cachedVideos) {
        parsedCachedVideos = JSON.parse(cachedVideos);
        if (!Array.isArray(parsedCachedVideos)) {
          parsedCachedVideos = [];
        }
      }

      const allVideos = [
        ...fetchedVideos,
        ...parsedCachedVideos.filter(
          (cachedVideo) =>
            !fetchedVideos.some(
              (fetchedVideo) => fetchedVideo._id === cachedVideo._id
            )
        ),
      ];

      setVideos(allVideos);
      localStorage.setItem("videos", JSON.stringify(allVideos));
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError(err.message || "Failed to load videos.");
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (videoId) => {
    const videoToDelete = videos.find((video) => video._id === videoId);
    const updatedVideos = videos.filter((video) => video._id !== videoId);
    setVideos(updatedVideos);
    localStorage.setItem("videos", JSON.stringify(updatedVideos));

    try {
      const response = await fetch(`http://localhost:5000/api/videos/${videoId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete video: ${response.statusText}`);
      }
    } catch (err) {
      console.error("Error deleting video:", err);
      alert(`Failed to delete video: ${err.message}`);

      setVideos((prevVideos) => {
        const restoredVideos = [...prevVideos, videoToDelete];
        localStorage.setItem("videos", JSON.stringify(restoredVideos));
        return restoredVideos;
      });
    }
  };

  const filterVideosByCategory = (category) => {
    if (category === "all") {
      return videos;
    }
    return videos.filter((video) => video.category === category);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div
      className="center"
      style={{
        width: "95vw",
        minHeight: "100vh",
        margin: 0,
        paddingLeft: 40,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Videos</h1>

      {/* Navbar for Category Filter */}
      <nav style={{ marginBottom: "30px", width: "100%", textAlign: "center" }}>
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            justifyContent: "center",
            padding: 0,
            margin: 0,
            backgroundColor: "#2c3e50",
            borderRadius: "30px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {categories.map((category) => (
            <li
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: "12px 20px",
                margin: "0 10px",
                backgroundColor:
                  selectedCategory === category ? "#1abc9c" : "transparent",
                color: selectedCategory === category ? "#fff" : "#ecf0f1",
                fontSize: "16px",
                fontWeight: "500",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease-in-out",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#16a085")}
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor =
                  selectedCategory === category ? "#1abc9c" : "transparent")
              }
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </li>
          ))}
        </ul>
      </nav>

      {/* Loading State */}
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <h2>Loading videos...</h2>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <h2 style={{ color: "red" }}>Error: {error}</h2>
        </div>
      )}

      {/* Video Grid */}
      {!loading && !error && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            width: "100%",
          }}
        >
          {filterVideosByCategory(selectedCategory).map((video) => (
            <div
              key={video._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "10px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
              }}
            >
              <h3 style={{ marginBottom: "10px" }}>{video.title}</h3>
              <p style={{ marginBottom: "10px", color: "#555" }}>
                {video.description}
              </p>
              <video
                width="100%"
                style={{
                  height: "300px", // Fixed smaller height for videos
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
                controls
              >
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this video?"
                    )
                  ) {
                    deleteVideo(video._id);
                  }
                }}
                style={{
                  marginTop: "10px",
                  padding: "8px 16px",
                  backgroundColor: "#ff4747",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "14px",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#ff2a2a")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#ff4747")
                }
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideosPage;
