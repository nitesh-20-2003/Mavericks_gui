import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { BiVideoRecording } from "react-icons/bi";
import { FaCircleStop } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";

const DataSet = () => {
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
  const [ISL, setISL] = useState(false);
  const [displayType, setDisplayType] = useState("emotion"); // 'emotion' or 'word'

  useEffect(() => {
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
    toast.success("Thank you for your contribution!");
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
      setSelectEnabled(true);
    } catch (error) {
      console.error("Error making POST request:", error);
    } finally {
      setLoading(false);
    }
  };

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
    <div className=" h-[70vh] flex flex-col items-center   max-w-[1120px] mx-auto ">
      <h2 className="font-[800] mt-6 mb-4  font-mono text-secondary text-2xl capitalize">
        Progressive Learning :
        <span className="text-gray-800">AI Model</span>
      </h2>
      <div className="card lg:card-side bg-base-100 shadow-xl w-full h-full flex">
        <figure className="flex-1 flex justify-center items-center">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </figure>
        <div className="card-body flex-1 overflow-y-auto">
          <div className="mt-5">
            <div className="">
              <ul className="list-disc pl-6">
                {ExtractedFeatures.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex gap-4 mt-5">
              
            </div>
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
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSet;
