import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { BiVideoRecording } from "react-icons/bi";
import { FaCircleStop } from "react-icons/fa6";
const Prediction = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [response, setResponse] = useState("Waiting for predictions...");

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

  const captureFrames = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const processFrame = () => {
      if (video.readyState !== 4) return;

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
        } else {
          console.error("Failed to capture frame or socket not connected.");
        }
      }, "image/jpeg");
    };

    // Capture frames at regular intervals
    setInterval(processFrame, 600);
  };

  useEffect(() => {
    startWebcam();
    captureFrames();

    if (socket) {
      socket.on("frame_processed", (data) => {
        console.log("Received data from server:", data);

        if (data.error) {
          setResponse(`Error: ${data.error}`);
        } else if (data.predictions) {
          setResponse(data.predictions.label);
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
    <div className=" w-[90vw] max-w-[1120px] mx-auto">
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
            <div className="label">
              <span className="label-text font-bold font-baloo  text-xl">
                Emotion detected
              </span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              value={response}
              className="input input-bordered w-full max-w-xs "
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text  font-bold font-baloo  text-xl">
                Enter Your input
              </span>
            </div>
            <textarea
              placeholder="Bio"
              className="textarea textarea-bordered textarea-md w-full max-w-xs"
            ></textarea>
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text font-bold font-baloo  text-xl ">
                Predicted String{" "}
              </span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs "
            />
          </label>

          <div className="card-actions justify-between mt-6">
            <button className="btn btn-outline">
              Start{" "}
              <span>
                <BiVideoRecording />{" "}
              </span>
            </button>
            <button className="btn btn-outline ">
              Stop
              <span>
                <FaCircleStop />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prediction;
