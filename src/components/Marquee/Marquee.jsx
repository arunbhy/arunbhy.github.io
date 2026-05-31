import React from "react";
import "./Marquee.css";

const items = [
  "PyTorch", "RAG", "Agentic AI", "Computer Vision",
  "Document Intelligence", "MCP", "Azure", "Diffusion Models",
];

const Marquee = () => {
  // duplicated once so the -50% translate loops seamlessly
  const loop = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="track">
        {loop.map((item, i) => (
          <span className="m-item" key={i}>{item}</span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
