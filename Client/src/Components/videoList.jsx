import React, { useEffect, useState } from "react";

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "happy", "sad", "laugh", "cry", "questioning"];

  const fetchVideos = async () => {
    try {
      const response = await fetch("http://localhost:5100/api/videos");
      if (!response.ok) {
        throw new Error(`Failed to fetch videos: ${response.statusText}`);
      }

      const fetchedVideos = await response.json();
      const cachedVideos = JSON.parse(localStorage.getItem("videos") || "[]");

      const allVideos = [
        ...fetchedVideos,
        ...cachedVideos.filter(
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
      const response = await fetch(`http://localhost:5100/api/videos/${videoId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`delete video: ${response.statusText}`);
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
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-10">
        Videos
      </h1>

      {/* Navbar for Category Filter */}
      <nav
        style={{
          marginBottom: "30px",
          width: "100%",
          textAlign: "center",
        }}
      >
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
            flexWrap: "wrap",
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
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </li>
          ))}
        </ul>
      </nav>

      {/* Loading and Error States */}
      {loading && <p className="text-center text-lg">Loading videos...</p>}
      {error && <p className="text-center text-lg text-red-500">{error}</p>}

      {/* Videos Grid */}
      {!loading && !error && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filterVideosByCategory(selectedCategory).map((video) => (
            <div
              key={video._id}
              className="bg-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 flex flex-col items-center justify-between"
            >
              <h3 className="text-xl font-semibold mb-2 text-center">{video.title}</h3>
              <p className="text-gray-600 mb-4 text-center">{video.description}</p>
              <video
                className="w-full h-48 object-cover rounded-lg mb-4"
                controls
                src={video.url}
              >
                Your browser does not support the video tag.
              </video>
              <button
                onClick={() =>
                  window.confirm("Delete this video?") && deleteVideo(video._id)
                }
                className="w-28 mx-auto bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all"
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
