"use client";

import { useMemo } from "react";
import "./DNAHelix.css";

export default function DNAHelix({
  numPairs = 20,
  spacing = 25,
  title = "DNA HELIX",
  showBackground = true,
}) {
  const pairs = useMemo(
    () =>
      Array.from({ length: numPairs }, (_, i) => ({
        angle: (i / numPairs) * 360,
        yPos: i * spacing,
        delay: i * 0.1,
      })),
    [numPairs, spacing]
  );

  return (
    <div className={`dna-root ${showBackground ? "with-bg" : ""}`}>
      <div className="dna-container">
        <div className="glow" />
        <div className="helix">
          {pairs.map(({ angle, yPos, delay }, idx) => (
            <div
              key={idx}
              className="base-pair"
              style={{ top: `${yPos}px`, transform: `rotateY(${angle}deg)` }}
            >
              <div
                className="strand left"
                style={{ animationDelay: `${delay}s` }}
              />
              <div className="connector" />
              <div
                className="strand right"
                style={{ animationDelay: `${delay}s` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
