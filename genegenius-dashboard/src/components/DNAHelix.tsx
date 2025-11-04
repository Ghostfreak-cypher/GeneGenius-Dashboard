"use client";

import { useMemo, CSSProperties } from "react";
import "./DNAHelix.css";

interface DNAHelixProps {
  numPairs?: number;
  spacing?: number;
  showBackground?: boolean;
}

interface BasePair {
  angle: number;
  yPos: number;
  delay: number;
}

export default function DNAHelix({
  numPairs = 20,
  spacing = 25,
  showBackground = true,
}: DNAHelixProps) {
  const pairs = useMemo<BasePair[]>(
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
              style={
                {
                  top: `${yPos}px`,
                  transform: `rotateY(${angle}deg)`,
                } as CSSProperties
              }
            >
              <div
                className="strand left"
                style={{ animationDelay: `${delay}s` } as CSSProperties}
              />
              <div className="connector" />
              <div
                className="strand right"
                style={{ animationDelay: `${delay}s` } as CSSProperties}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
