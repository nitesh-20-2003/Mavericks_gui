import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { BsFillRecordBtnFill } from "react-icons/bs";
import { AiOutlineStop } from "react-icons/ai";
import { predictionHeading } from "../Components";
function Prediction() {
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [predictedEmotion, setPredictedEmotion] = useState("");
  const [inputString, setInputString] = useState("");
  const [generatedString, setGeneratedString] = useState("");
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  useEffect(() => {
    if (!isCameraInitialized) {
      initializeCamera();
    }
    return () => stopStream();
  }, []);

  const initializeCamera = () => {
    return navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
        },
      })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraInitialized(true);
        }
      })
      .catch((err) => console.error("Error accessing camera: ", err));
  };

  const startRecording = () => {
    if (!videoRef.current?.srcObject) {
      initializeCamera().then(() => {
        startMediaRecorder();
      });
    } else {
      startMediaRecorder();
    }
  };

  const startMediaRecorder = () => {
    setIsRecording(true);
    recordedChunks.current = [];

    const options = { mimeType: "video/webm; codecs=vp8" };
    const mediaRecorder = new MediaRecorder(
      videoRef.current.srcObject,
      options
    );
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      recordedChunks.current.push(event.data);
    };
    mediaRecorder.onstop = handleRecordingStop;
    mediaRecorder.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    stopStream();
  };

  const stopStream = () => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraInitialized(false);
  };

  const handleRecordingStop = () => {
    const videoBlobData = new Blob(recordedChunks.current, {
      type: "video/webm",
    });
    setVideoBlob(videoBlobData);
    sendVideoToServer(videoBlobData);
  };

  const sendVideoToServer = (videoBlob) => {
    const formData = new FormData();
    formData.append("video", videoBlob, "video.webm");

    axios
      .post("http://localhost:5000/video/convert", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Video processed successfully!", response.data);
      })
      .catch((error) => {
        console.error("Error processing video:", error);
      });
  };

  const handleEmotionChange = (event) => {
    setPredictedEmotion(event.target.value);
  };

  const handleInputChange = (event) => {
    setInputString(event.target.value);
  };

  const handleGenerateString = async () => {
    try {
      const response = await axios.post("http://localhost:5000/ai/generate", {
        sentence: inputString,
        emotion: predictedEmotion,
      });
      console.log("Generated response:", response.data);
      setGeneratedString(response.data.rewritten_sentence);
    } catch (error) {
      console.error("Error generating string:", error);
    }
  };

  // Function to clear the generated string
  const clearGeneratedString = () => {
    setGeneratedString("");
  };

  return (
    <div className="w-[90vw] max-w-[1120px] mx-auto">
      <div className="flex items-center justify-center">
        <h2 className="font-[800] mt-6 mb-[3.5rem] capitalize font-mono text-secondary">
          Language that evokes Feelings: <span className="text-gray-800">ISL</span>
        </h2>
      </div>

      <div className="card lg:card-side bg-base-100 shadow-2xl">
        <figure>
          <video
            ref={videoRef}
            autoPlay
            muted
            className="rounded-tl-lg rounded-bl-lg bg-black w-[480px] h-[600px] md:h-[500px] md:w-[600px] lg:h-[600px] object-cover lg:w-[700px]"
          ></video>
        </figure>
        <div className="card-body">
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-baloo font-bold text-lg">
                Predicted Emotion
              </span>
            </label>
            <input
              type="text"
              placeholder="Enter Predicted Emotion"
              value={predictedEmotion}
              onChange={handleEmotionChange}
              className="input input-bordered"
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-baloo font-bold text-lg">
                Enter Your String
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered"
              placeholder="Type your string here"
              value={inputString}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-baloo font-bold text-lg">
                Generated String
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered"
              value={generatedString}
              readOnly
              placeholder="Generated string based on emotion"
            ></textarea>
          </div>
          <div className="card-actions justify-start mt-4">
            <div className="flex items-center space-x-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="btn btn-outline rounded-full px-6 py-3"
                >
                  Rec
                  <span>
                    <BsFillRecordBtnFill />
                  </span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="btn btn-outline rounded-full px-6 py-3"
                >
                  Stop
                  <span>
                    <AiOutlineStop />
                  </span>
                </button>
              )}
              <button
                onClick={handleGenerateString}
                className="btn btn-outline"
              >
                Generate
              </button>
              {/* Add the Clear button */}
              <button
                onClick={clearGeneratedString}
                className="btn btn-outline"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Prediction;
