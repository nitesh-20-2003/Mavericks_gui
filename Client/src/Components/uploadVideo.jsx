import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";

const UploadVideo = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("User is not authenticated");
    }
  }, []);

  const handleUpload = async () => {
    if (!file || !title || !description || !category) {
      setMessage("Please fill out all fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5100/api/videos/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Video uploaded successfully!");
        setFile(null);
        setTitle("");
        setDescription("");
        setCategory("");
      } else {
        setMessage(data.message || "Failed to upload video.");
      }
    } catch (error) {
      setMessage("Error uploading video.");
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "video/*",
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto p-8 bg-gradient-to-r from-indigo-200 to-blue-200 rounded-xl shadow-xl"
    >
      <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">
        Upload Video
      </h1>

      {/* Drag and Drop Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="border-2 border-dashed border-indigo-500 p-8 rounded-lg text-center cursor-pointer bg-gray-100 hover:bg-gray-200"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {file ? (
          <p className="text-gray-800">{file.name}</p>
        ) : (
          <p className="text-gray-600">
            Drag & Drop your video here, or click to select a file
          </p>
        )}
      </motion.div>

      {/* Title Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mt-4"
      >
        <input
          type="text"
          placeholder="Enter video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </motion.div>

      {/* Description Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="mt-4"
      >
        <textarea
          placeholder="Enter video description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        ></textarea>
      </motion.div>

      {/* Category Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="mt-4"
      >
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select Expression</option>
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
          <option value="laugh">Laugh</option>
          <option value="cry">Cry</option>
          <option value="questioning">Questioning</option>
        </select>
      </motion.div>

      {/* Upload Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleUpload}
        disabled={loading}
        className={`w-full mt-6 p-4 rounded-lg font-bold text-white transition-all focus:outline-none ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-400 hover:to-blue-400"
        }`}
      >
        {loading ? "Uploading..." : "Upload"}
      </motion.button>

      {/* Message Display */}
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`mt-6 text-center font-semibold ${
            message.includes("Error") ? "text-red-500" : "text-green-500"
          }`}
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
};

export default UploadVideo;
