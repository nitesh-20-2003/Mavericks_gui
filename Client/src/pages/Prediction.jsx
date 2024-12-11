import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { BiVideoRecording } from "react-icons/bi";
import { FaCircleStop } from "react-icons/fa6";
import axios from "axios";

const Prediction = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [response, setResponse] = useState("Waiting for predictions...");
  const [recording, setRecording] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [emotionDetected, setEmotionDetected] = useState("");
  const [userInput, setUserInput] = useState("");
  const [nonManualFeatures, setNonManualFeatures] = useState([]);
  const [rewrittenSentence, setRewrittenSentence] = useState("");
  const [loading, setLoading] = useState(false); // For disabling the button after click
  const [selectEnabled, setSelectEnabled] = useState(false); // To enable the select component
  const [inputsDisabled, setInputsDisabled] = useState(true); // Manage the disabled state of inputs

  useEffect(() => {
    // Initialize WebSocket connection
    const socketInstance = io("http://localhost:5000");
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const startWebcam = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((error) => {
        console.error("Error accessing webcam:", error);
      });
  };

  const stopWebcam = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const startRecording = () => {
    setRecording(true);
    startWebcam();

    const processFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video.readyState === 4) {
        const context = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob && socket) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64Image = reader.result;
              socket.emit("process_frame", base64Image);
            };
            reader.readAsDataURL(blob);
          }
        }, "image/jpeg");
      }
    };

    const id = setInterval(processFrame, 600);
    setIntervalId(id);
  };

  const stopRecording = () => {
    setRecording(false);
    stopWebcam();

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    // Enable the inputs after stop
    setInputsDisabled(false);
  };

  const sendPredictionRequest = async () => {
    setLoading(true); // Disable the button on click
    try {
      const response = await axios.post(
        "http://localhost:5102/api/py/generate",
        {
          sentence: userInput,
          emotion: emotionDetected,
        }
      );

      const data = response.data;

      // Update non-manual features in the select dropdown
      const features = data.non_manual_features
        .filter((line) => line.startsWith("*"))
        .map((line) => line.replace("*", "").trim());

      setNonManualFeatures(features);
      setRewrittenSentence(data.rewritten_sentence);

      // Enable the select component after the API response
      setSelectEnabled(true);
    } catch (error) {
      console.error("Error making POST request:", error);
    } finally {
      setLoading(false); // Re-enable the button
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("frame_processed", (data) => {
        console.log("Received data from server:", data);

        if (data.error) {
          setResponse(`Error: ${data.error}`);
        } else if (data.predictions) {
          setEmotionDetected(data.predictions.label);
          setResponse(data.predictions.label); // Show detected emotion
        } else {
          setResponse("Unexpected response from server.");
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
          Language that evokes Feelings:{" "}
          <span className="text-gray-800">ISL</span>
        </h2>
      </div>
      <div className="card lg:card-side bg-base-100 shadow-xl">
        <figure>
          <video ref={videoRef} />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </figure>
        <div className="card-body">
          <label className="form-control w-full max-w-xs">
            <div className="font-baloo">
              <select
                className="select select-bordered w-full max-w-xs"
                disabled={!selectEnabled} // Enable the select after API response
              >
                <option disabled selected>
                  Nmf emotion detected
                </option>
                {nonManualFeatures.map((feature, index) => (
                  <option key={index}>{feature}</option>
                ))}
              </select>
            </div>

            <div className="label">
              <span className="label-text font-bold font-baloo text-xl">
                Emotion detected
              </span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              value={emotionDetected}
              className="input input-bordered w-full max-w-xs "
              readOnly
            />
          </label>

          {/* Enter your string */}
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text font-bold text-xl font-baloo">
                Enter your string
              </span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={inputsDisabled} // Initially disabled
            />
          </label>

          {/* Your predicted string */}
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text font-bold text-xl font-baloo">
                String From GenAi
              </span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              value={rewrittenSentence}
              className="input input-bordered input-lg w-full max-w-xs"
              readOnly
              disabled={inputsDisabled} // Initially disabled
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
            {/* Send button disabled while loading */}
            <button
              className="btn btn-outline"
              onClick={sendPredictionRequest}
              disabled={loading || !emotionDetected || !userInput} // Disable when loading or missing inputs
            >
              {loading ? "Sending..." : "Send to GenAi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prediction;
