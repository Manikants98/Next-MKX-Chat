import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full dots">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="dot"
          style={{
            "--i": index,
            "--size": "64px",
            "--dot-size": "6px",
            "--dot-count": "6",
            "--color": "#fff",
            "--speed": "1s",
            "--spread": "60deg",
          }}
        ></div>
      ))}
    </div>
  );
};

export default Loader;
