import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { BiVideoRecording } from "react-icons/bi";
import { FaCircleStop } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";

const Prediction = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [response, setResponse] = useState("Waiting for predictions...");
  const [ExtractedFeatures, setExtractedFeatures] = useState([]);
  const [recording, setRecording] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [emotionDetected, setEmotionDetected] = useState("");
  const [wordDetected, setWordDetected] = useState("");
  const [userInput, setUserInput] = useState("");
  const [nonManualFeatures, setNonManualFeatures] = useState([]);
  const [rewrittenSentence, setRewrittenSentence] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectEnabled, setSelectEnabled] = useState(false);
  const [inputsDisabled, setInputsDisabled] = useState(true);

  // Initialize WebSocket connection
  useEffect(() => {
    const socketInstance = io("http://localhost:5000");
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Start webcam streaming
  const startWebcam = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((error) => console.error("Error accessing webcam:", error));
  };

  // Stop webcam streaming
  const stopWebcam = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Start recording video frames
  const startRecording = () => {
    setRecording(true);
    startWebcam();

    setTimeout(() => {
      const id = setInterval(processFrame, 600);
      setIntervalId(id);
    }, 1000);
  };

  // Stop recording video frames
  const stopRecording = () => {
    toast.success("Video recording stopped successfully!");
    setRecording(false);
    stopWebcam();

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    setInputsDisabled(false);
  };

  // Process individual video frames
  const processFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      console.warn("Video or Canvas is not available.");
      return;
    }

    if (video.readyState !== 4) {
      console.warn("Video is not ready yet.");
      return;
    }

    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob && socket) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Image = reader.result;
            socket.emit("process_frame", base64Image);
          };
          reader.readAsDataURL(blob);
        }
      },
      "image/jpeg",
      0.7
    );
  };

  // Send prediction request to the backend
  const sendPredictionRequest = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5102/api/py/generate", {
        sentence: userInput,
        emotion: emotionDetected,
      });

      const data = response.data;
      const features = data.non_manual_features
        .filter((line) => line.startsWith("*"))
        .map((line) => line.replace("*", "").trim());

      setNonManualFeatures(features);
      setRewrittenSentence(data.rewritten_sentence);
      setSelectEnabled(true);
    } catch (error) {
      console.error("Error making POST request:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle socket events
  useEffect(() => {
    if (socket) {
      socket.on("frame_processed", (data) => {
        if (data.face_analysis) {
          const faceAnalysisArray = Object.entries(data.face_analysis).map(
            ([key, value]) => `${key}: ${value}`
          );

          setExtractedFeatures(faceAnalysisArray);
        }

        if (data.error) {
          setResponse(`Error: ${data.error}`);
        } else if (data.predictions) {
          setEmotionDetected(data.predictions.label);
          setResponse(data.predictions.label);
        }

        if (data.predictions2) {
          setWordDetected(data.predictions2.label);
        }
      });

      return () => {
        socket.off("frame_processed");
      };
    }
  }, [socket]);

  return (
    <div className="w-[90vw] max-w-[1120px] mx-auto">
      <div className="flex items-center justify-center">
        <h2 className="font-[800] mt-6 mb-[3.5rem] capitalize font-mono text-secondary">
          Language that evokes Feelings: <span className="text-gray-800">ISL</span>
        </h2>
      </div>
      <div className="card lg:card-side bg-base-100 shadow-xl">
        <figure>
          <video ref={videoRef} />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </figure>
        <div className="card-body">
          <label className="form-control w-full max-w-xs">
            <select
              className="select select-bordered select-md w-full max-w-xs h-[12rem]"
              size={ExtractedFeatures.length || 5}
              style={{ maxHeight: "none", overflow: "visible" }}
              disabled={!ExtractedFeatures.length}
            >
              <option disabled selected>
                NMF Parameters...
              </option>
              {ExtractedFeatures.map((feature, index) => (
                <option key={index}>{feature}</option>
              ))}
            </select>
          </label>
          <div className="mt-45">
            <label className="form-control w-full max-w-xs">
              <input
                type="text"
                value={emotionDetected}
                placeholder="Detected Emotion"
                className="input input-bordered"
                readOnly
              />
            </label>
            <label className="form-control w-full max-w-xs mt-5">
              <input
                type="text"
                value={wordDetected}
                placeholder="ISL Sentence"
                className="input input-bordered"
                readOnly
              />
            </label>

            <label className="form-control w-full max-w-xs mt-7">
              <input
                type="text"
                placeholder="Enter your string"
                className="input input-bordered"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={inputsDisabled}
              />
            </label>

            <label className="form-control w-full max-w-xs mt-7">
              <input
                type="text"
                value={rewrittenSentence}
                placeholder="String from GenAI"
                className="input input-bordered"
                readOnly
                disabled={inputsDisabled}
              />
            </label>

            <div className="card-actions justify-between mt-6">
              <button
                className="btn btn-outline"
                onClick={startRecording}
                disabled={recording}
              >
                Start <BiVideoRecording />
              </button>
                            <button
                className="btn btn-outline"
                onClick={stopRecording}
                disabled={!recording}
              >
                Stop <FaCircleStop />
              </button>
              <button
                className="btn btn-primary"
                onClick={sendPredictionRequest}
                disabled={loading || inputsDisabled}
              >
                {loading ? "Processing..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prediction;

