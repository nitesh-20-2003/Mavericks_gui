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
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 via-purple-200 to-pink-300 py-10 px-4">
      <h1 className="text-5xl font-extrabold text-center text-white mb-12 drop-shadow-xl animate-pulse">
        Dataset
      </h1>

      {/* Navbar for Category Filter */}
      <nav className="mb-12">
        <ul className="flex justify-center gap-4 flex-wrap p-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-400 shadow-lg">
          {categories.map((category) => (
            <li
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 text-white font-medium rounded-full cursor-pointer transition-all duration-300 relative ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-blue-500 to-green-400 scale-110 shadow-lg"
                  : "hover:text-black hover:scale-105"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
              <span
                className={`absolute left-0 bottom-0 w-full h-1 bg-white transform transition-all duration-300 ${
                  selectedCategory === category ? "scale-100" : "scale-0"
                }`}
              ></span>
            </li>
          ))}
        </ul>
      </nav>

      {/* Loading and Error States */}
      {loading && (
        <p className="text-center text-xl font-medium text-gray-700 animate-bounce">
          Loading videos...
        </p>
      )}
      {error && (
        <p className="text-center text-lg text-red-600 font-semibold">
          {error}
        </p>
      )}

      {/* Videos Grid */}
      {!loading && !error && (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filterVideosByCategory(selectedCategory).map((video) => (
            <div
              key={video._id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:rotate-1 hover:scale-105 flex flex-col items-center"
            >
              <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
                {video.title}
              </h3>
              <p className="text-gray-600 mb-4 text-sm text-center">
                {video.description}
              </p>
              <video
                className="w-full h-40 object-cover rounded-lg mb-4 shadow-md hover:shadow-lg transition-transform transform hover:scale-110"
                controls
                src={video.url}
              >
                Your browser does not support the video tag.
              </video>
              <button
                onClick={() =>
                  window.confirm("Are you sure you want to delete this video?") &&
                  deleteVideo(video._id)
                }
                className="w-full bg-gradient-to-r from-red-400 to-pink-500 text-white py-2 rounded-lg hover:from-red-500 hover:to-pink-600 transition-all shadow-md"
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
