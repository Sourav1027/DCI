import React from "react";
import { useState } from "react";
import img from "./ml.png"; // Import your Logo component

const Logo = () => {
  // Simulate theme functionality (since `next-themes` is specific to Next.js)
  const [theme, setTheme] = useState("light");

  return (
    <div className="d-flex justify-content-center align-items-center gap-2">
      <img
        src={img}
        alt=""
        style={{
          width: "40px", // Adjust the size as needed
          height: "40px",
          backgroundColor: "black",
          borderRadius: "15px 15px 0 15px", // Matches the rounded corners
        }}
      />
      <span className="fs-4 fw-bold" style={{ fontFamily: "Libre Baskerville, serif" }}>
        DcodeTech
      </span>
    </div>
  );
};

export default Logo;
