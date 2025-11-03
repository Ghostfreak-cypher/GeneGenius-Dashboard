"use client";

import { useMemo } from "react";

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

      <style jsx global>{`
        .dna-root {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
        .dna-root.with-bg {
          background: black;
        }

        .dna-container {
          position: relative;
          width: 100%;
          height: 100%;
          perspective: 800px;
        }

        @media (min-width: 640px) {
          .dna-container {
            perspective: 1000px;
          }
        }

        @media (min-width: 1024px) {
          .dna-container {
            perspective: 1200px;
          }
        }

        .helix {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: rotate 10s linear infinite;
        }

        .base-pair {
          position: absolute;
          width: 100%;
          height: 15px;
          transform-style: preserve-3d;
        }

        @media (min-width: 640px) {
          .base-pair {
            height: 20px;
          }
        }

        .strand {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          box-shadow: 0 0 15px currentColor;
        }

        @media (min-width: 640px) {
          .strand {
            width: 16px;
            height: 16px;
            box-shadow: 0 0 18px currentColor;
          }
        }

        @media (min-width: 1024px) {
          .strand {
            width: 20px;
            height: 20px;
            box-shadow: 0 0 20px currentColor;
          }
        }

        .strand.left {
          left: 0;
          background: linear-gradient(135deg, #000, #aaa);
        }

        .strand.right {
          right: 0;
          background: linear-gradient(135deg, #fff, #ddd);
        }

        .connector {
          position: absolute;
          width: calc(100% - 24px);
          height: 2px;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: linear-gradient(90deg, #000, #777, #000);
          opacity: 0.35;
          box-shadow: 0 0 6px rgba(0, 0, 0, 0.25);
        }

        @media (min-width: 640px) {
          .connector {
            width: calc(100% - 32px);
            height: 2.5px;
            left: 16px;
            box-shadow: 0 0 7px rgba(0, 0, 0, 0.25);
          }
        }

        @media (min-width: 1024px) {
          .connector {
            width: calc(100% - 40px);
            height: 3px;
            left: 20px;
            box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
          }
        }

        .glow {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle,
            rgba(0, 0, 0, 0.18) 0%,
            transparent 70%
          );
          animation: pulse 2s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes rotate {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(360deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
