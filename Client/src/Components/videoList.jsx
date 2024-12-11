import { useEffect, useState } from "react";

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "happy", "sad", "surprise", "Neutral", "anger"];

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5100/api/videos");
      if (!response.ok) {
        throw new Error(`Failed to fetch videos: ${response.statusText}`);
      }

      const fetchedVideos = await response.json();

      // Retrieve the cached videos from LocalStorage
      const cachedVideos = JSON.parse(localStorage.getItem("videos") || "[]");

      // Identify videos that are new or updated
      const newOrUpdatedVideos = fetchedVideos.filter(
        (fetchedVideo) =>
          !cachedVideos.some(
            (cachedVideo) =>
              cachedVideo._id === fetchedVideo._id &&
              cachedVideo.updatedAt === fetchedVideo.updatedAt
          )
      );

      // Combine the cached videos with the new or updated ones
      const updatedVideos = [...cachedVideos, ...newOrUpdatedVideos];

      // Save the updated videos to the state and LocalStorage
      setVideos(updatedVideos);
      localStorage.setItem("videos", JSON.stringify(updatedVideos));
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError(err.message || "Failed to load videos.");
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 mb-12 text-white rounded-xl shadow-xl">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            Welcome to our video dataset
          </h1>
          <p className="text-xl mb-6 max-w-3xl mx-auto">
            Here, you can explore a collection of videos categorized into
            different types such as happy, sad, and more. You can also
            contribute to this dataset by creating your own videos. Simply go to
            create dataset in sidebar to upload and add your videos to help grow
            the collection!
          </p>
        </div>
      </section>

      <div className="flex justify-center gap-6 mb-12 w-full">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`py-2 px-4 rounded-full text-lg font-semibold transition-all duration-300 w-1/5 ${
              selectedCategory === category
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-blue-700 border border-blue-300 hover:bg-blue-500 hover:text-white"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center my-12">
          <button className="btn btn-primary btn-lg loading">
            Loading videos...
          </button>
        </div>
      )}
      {error && (
        <p className="text-center text-lg text-red-600 font-semibold my-12">
          {error}
        </p>
      )}

      {/* Videos Grid */}
      {!loading && !error && (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filterVideosByCategory(selectedCategory).map((video) => (
            <div
              key={video._id}
              className="card bg-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-blue-300 rounded-lg overflow-hidden"
            >
              <figure>
                <video
                  className="w-full h-48 object-cover rounded-t-lg"
                  controls
                  muted
                  src={video.url}
                >
                  Your browser does not support the video tag.
                </video>
              </figure>
              <div className="card-body p-6">
                <h3 className="card-title text-xl font-semibold text-blue-800 mb-2">
                  {video.title || "Untitled Video"}
                </h3>
                <p className="text-blue-600 text-sm">
                  Uploaded by:{" "}
                  <span className="font-medium">
                    {video.username || "Anonymous"}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideosPage;
