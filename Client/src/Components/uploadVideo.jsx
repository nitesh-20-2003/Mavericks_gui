import React, { useState } from "react";

const UploadVideo = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(""); // New state for category (expression)
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!category) {
      setMessage("Please select a category (expression type).");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category); // Include category in the form data

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/videos/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        console.log("Uploaded Video:", data.video);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Error uploading video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Upload Video</h1>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      
      {/* New Dropdown or Input for Category (Expression) */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select Expression</option>
        <option value="happy">Happy</option>
        <option value="sad">Sad</option>
        <option value="laugh">Laugh</option>
        <option value="cry">Cry</option>
        <option value="questioning">Questioning</option>
      </select>

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadVideo;
