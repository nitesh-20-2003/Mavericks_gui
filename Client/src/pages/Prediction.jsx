import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { BiVideoRecording } from "react-icons/bi";
import { FaCircleStop } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";

const Prediction = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [socket5000, setSocket5000] = useState(null);
  const [socket5103, setSocket5103] = useState(null);
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
  const [inputsDisabled, setInputsDisabled] = useState(true);

  useEffect(() => {
    const socketInstance5000 = io("http://localhost:5000");
    const socketInstance5103 = io("http://localhost:5103");
    setSocket5000(socketInstance5000);
    setSocket5103(socketInstance5103);

    return () => {
      socketInstance5000.disconnect();
      socketInstance5103.disconnect();
    };
  }, []);

  const startWebcam = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((error) => console.error("Error accessing webcam:", error));
  };

  const stopWebcam = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const startRecording = () => {
    setRecording(true);
    startWebcam();

    setTimeout(() => {
      const id = setInterval(processFrame, 550);
      setIntervalId(id);
    }, 1000);
  };

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
        if (blob) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Image = reader.result;
            if (socket5000) socket5000.emit("process_frame", base64Image);
            if (socket5103) socket5103.emit("process_frame", base64Image);
          };
          reader.readAsDataURL(blob);
        }
      },
      "image/jpeg",
      0.7
    );
  };

  const sendPredictionRequest = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5102/api/py/generate",
        {
          sentence: userInput,
          emotion: emotionDetected,
        }
      );

      const data = response.data;
      const features = data.non_manual_features
        .filter((line) => line.startsWith("*"))
        .map((line) => line.replace("*", "").trim());

      setNonManualFeatures(features);
      setRewrittenSentence(data.rewritten_sentence);
    } catch (error) {
      console.error("Error making POST request:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (socket5000) {
      socket5000.on("frame_processed", (data) => {
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
      });
    }

    if (socket5103) {
      socket5103.on("frame_processed", (data) => {
        if (data.predictions2) {
          setWordDetected(data.predictions2.label);
        }
      });
    }

    return () => {
      if (socket5000) socket5000.off("frame_processed");
      if (socket5103) socket5103.off("frame_processed");
    };
  }, [socket5000, socket5103]);

  return (
    <div className="h-[80vh] flex flex-col items-center w-[70vw]  mx-auto card shadow-2xl">
      <h2 className="font-[800] mt-6 mb-4 capitalize font-mono text-secondary text-2xl">
        Language that evokes Feelings:{" "}
        <span className="text-gray-800">ISL</span>
      </h2>
      <div className="card lg:card-side bg-base-100 shadow-xl w-full h-full flex">
        <figure className="flex-1 flex justify-center items-center w-[100%] mx-auto ">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </figure>

        <div className="card-body flex-1 overflow-y-auto ">
          <div className="mt-5">
            <div className="">
              <h3 className="font-bold mb-2 font-mono">NMF Parameters:</h3>
              <ul className="list-disc pl-6">
                {ExtractedFeatures.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <label className="form-control w-full max-w-xs">
              <input
                type="text"
                value={emotionDetected}
                placeholder="Detected Emotion"
                className="input input-bordered"
                readOnly
              />
            </label>
            <label className="form-control w-full max-w-xs mt-4">
              <input
                type="text"
                value={wordDetected}
                placeholder="ISL Sentence"
                className="input input-bordered"
                readOnly
              />
            </label>
          </div>
          <div className="mt-6">
            <label className="form-control w-full max-w-xs">
              <span className="label-text font-bold">User Input:</span>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter a sentence for ISL translation"
                className="input input-bordered"
                disabled={inputsDisabled}
              />
            </label>
            <button
              className={`btn btn-primary mt-4 ${loading ? "loading" : ""}`}
              onClick={sendPredictionRequest}
              disabled={loading || inputsDisabled}
            >
              {loading ? "Processing..." : "Generate ISL Translation"}
            </button>
            {rewrittenSentence && (
              <div className="mt-4">
                <h3 className="font-bold">Rewritten Sentence:</h3>
                <p className="text-gray-700">{rewrittenSentence}</p>
              </div>
            )}
            {nonManualFeatures.length > 0 && (
              <div className="mt-4">
                <h3 className="font-bold">Non-Manual Features:</h3>
                <ul className="list-disc pl-6">
                  {nonManualFeatures.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="mt-6 flex gap-4">
            <button
              className={`btn ${
                recording
                  ? "btn btn-outline btn-primary"
                  : "btn btn-outline btn-secondary"
              }`}
              onClick={recording ? stopRecording : startRecording}
            >
              {recording ? (
                <>
                  <FaCircleStop className="mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <BiVideoRecording className="mr-2" />
                  Start Recording
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prediction;
