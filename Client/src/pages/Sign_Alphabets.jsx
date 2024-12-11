import React from "react";

const Sign_Alphabets = () => {
  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      <iframe
        src="http://localhost:3000/sign-kit/learn-sign"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
        title="Learn Sign Language"
      />
    </div>
  );
};

export default Sign_Alphabets;
