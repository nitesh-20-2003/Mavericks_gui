import React from 'react'

const TextToSign = () => {
  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      <iframe
        src="http://localhost:3000/sign-kit/convert"
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
}

export default TextToSign