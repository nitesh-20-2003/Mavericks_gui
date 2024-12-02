import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

const UploadVideo = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(); // Ref for file input

  // Reset form fields
  const resetForm = () => {
    setFile(null);
    setTitle("");
    setDescription("");
    setCategory("");
    if (fileInputRef.current) fileInputRef.current.value = ""; // Clear file input
  };

  // Handle video upload
  const handleUpload = async () => {
    if (!file || !title || !description || !category) {
      setMessage("Please fill out all fields.");
      return;
    }

    // FormData setup for video upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);

    setLoading(true);
    setMessage(""); // Clear previous messages

    try {
      const response = await fetch("http://localhost:5100/api/videos/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Upload response:", data); // Debugging: Log response from server

      if (response.ok) {
        setMessage("Video uploaded successfully!"); // Success message
        resetForm(); // Reset form fields
      } else {
        setMessage(data.message || "Failed to upload video.");
      }
    } catch (error) {
      setMessage(`Error uploading video: ${error.message}`);
      console.error("Upload error:", error); // Log the error for debugging
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "20px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
        borderRadius: "15px",
        background: "linear-gradient(145deg, #f5f7fa, #c3cfe2)",
        fontFamily: "'Poppins', sans-serif",
        color: "#333",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "20px",
          color: "#2c3e50",
          fontSize: "28px",
          fontWeight: "bold",
        }}
      >
        Upload Video
      </h1>

      {/* Video File Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        style={{ marginBottom: "15px" }}
      >
        <label
          style={{
            fontWeight: "bold",
            display: "block",
            marginBottom: "5px",
            color: "#555",
          }}
        >
          Video File
        </label>
        <input
          type="file"
          accept="video/*"
          ref={fileInputRef} // Attach ref
          onChange={(e) => setFile(e.target.files[0])}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #dfe6e9",
            backgroundColor: "#fff",
            color: "#333",
            transition: "box-shadow 0.3s ease",
          }}
        />
      </motion.div>

      {/* Title Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        style={{ marginBottom: "15px" }}
      >
        <label
          style={{
            fontWeight: "bold",
            display: "block",
            marginBottom: "5px",
            color: "#555",
          }}
        >
          Title
        </label>
        <input
          type="text"
          placeholder="Enter video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #dfe6e9",
            backgroundColor: "#fff",
            color: "#333",
          }}
        />
      </motion.div>

      {/* Description Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        style={{ marginBottom: "15px" }}
      >
        <label
          style={{
            fontWeight: "bold",
            display: "block",
            marginBottom: "5px",
            color: "#555",
          }}
        >
          Description
        </label>
        <textarea
          placeholder="Enter video description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #dfe6e9",
            backgroundColor: "#fff",
            color: "#333",
            minHeight: "80px",
          }}
        ></textarea>
      </motion.div>

      {/* Category Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        style={{ marginBottom: "20px" }}
      >
        <label
          style={{
            fontWeight: "bold",
            display: "block",
            marginBottom: "5px",
            color: "#555",
          }}
        >
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #dfe6e9",
            backgroundColor: "#fff",
            color: "#333",
          }}
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
        style={{
          width: "100%",
          padding: "12px",
          background: loading
            ? "linear-gradient(to right, #bdc3c7, #ecf0f1)"
            : "linear-gradient(to right, #6a11cb, #2575fc)",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: "bold",
          fontSize: "16px",
          transition: "background 0.3s ease",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        {loading ? "Uploading..." : "Upload"}
      </motion.button>

      {/* Message Display */}
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            marginTop: "20px",
            textAlign: "center",
            color: message.includes("Error") ? "#e74c3c" : "#2ecc71",
            fontWeight: "bold",
          }}
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
};

export default UploadVideo;



