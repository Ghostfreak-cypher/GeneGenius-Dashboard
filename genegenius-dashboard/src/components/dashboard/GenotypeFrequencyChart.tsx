"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Info, MoreVertical, Settings } from "lucide-react";

export function GenotypeFrequencyChart() {
  // Simulating molecular structure data
  const molecules = [
    { id: 1, x: 120, y: 80, size: 45, color: "#c084fc", glow: "#a855f7" },
    { id: 2, x: 180, y: 60, size: 50, color: "#f9a8d4", glow: "#ec4899" },
    { id: 3, x: 160, y: 120, size: 48, color: "#c084fc", glow: "#a855f7" },
    { id: 4, x: 240, y: 100, size: 42, color: "#f9a8d4", glow: "#ec4899" },
    { id: 5, x: 200, y: 150, size: 38, color: "#c084fc", glow: "#a855f7" },
    { id: 6, x: 280, y: 140, size: 44, color: "#f87171", glow: "#ef4444" },
    { id: 7, x: 260, y: 190, size: 40, color: "#f9a8d4", glow: "#ec4899" },
    { id: 8, x: 320, y: 160, size: 46, color: "#c084fc", glow: "#a855f7" },
    { id: 9, x: 340, y: 210, size: 41, color: "#f9a8d4", glow: "#ec4899" },
    { id: 10, x: 380, y: 180, size: 43, color: "#f87171", glow: "#ef4444" },
  ];

  return (
    <Card className="bg-[#1a1f28] border-gray-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg font-medium">
            Genotype frequency
          </CardTitle>
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-gray-800 rounded-md transition-colors">
              <Settings className="h-4 w-4 text-gray-400" />
            </button>
            <button className="p-1.5 hover:bg-gray-800 rounded-md transition-colors">
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f1419] border border-gray-700 rounded-md text-sm text-gray-300 hover:bg-gray-800 transition-colors">
            <Filter className="h-3.5 w-3.5" />
            <span className="text-blue-400">◉</span>
            Regulation
          </button>
        </div>
        <div className="flex items-center justify-between mt-4 text-xs">
          <div className="text-gray-400">
            11.47
            <br />
            Testing SNP-biased
          </div>
          <div className="space-y-2 text-right">
            <div>
              <span className="text-gray-400">↗ </span>
              <span className="text-green-400">3.2</span>
              <span className="text-gray-500 ml-1">high</span>
            </div>
            <div>
              <span className="text-gray-400">↘ </span>
              <span className="text-gray-400">2.6</span>
              <span className="text-gray-500 ml-1">diff</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Molecular Visualization */}
        <div className="relative h-[280px] bg-[#0f1419] rounded-lg overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 400 280">
            {/* Connection lines */}
            {molecules.map((mol, i) => {
              if (i < molecules.length - 1) {
                const next = molecules[i + 1];
                return (
                  <line
                    key={`line-${i}`}
                    x1={mol.x}
                    y1={mol.y}
                    x2={next.x}
                    y2={next.y}
                    stroke="#374151"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                );
              }
              return null;
            })}

            {/* Molecules */}
            {molecules.map((mol) => (
              <g key={mol.id}>
                {/* Glow effect */}
                <circle
                  cx={mol.x}
                  cy={mol.y}
                  r={mol.size}
                  fill={mol.glow}
                  opacity="0.15"
                  filter="blur(8px)"
                />
                {/* Main sphere with gradient */}
                <defs>
                  <radialGradient id={`grad-${mol.id}`}>
                    <stop offset="0%" stopColor={mol.color} stopOpacity="1" />
                    <stop
                      offset="70%"
                      stopColor={mol.color}
                      stopOpacity="0.8"
                    />
                    <stop
                      offset="100%"
                      stopColor={mol.color}
                      stopOpacity="0.4"
                    />
                  </radialGradient>
                </defs>
                <circle
                  cx={mol.x}
                  cy={mol.y}
                  r={mol.size / 2}
                  fill={`url(#grad-${mol.id})`}
                  className="transition-all hover:scale-110 cursor-pointer"
                />
                {/* Highlight */}
                <circle
                  cx={mol.x - mol.size / 6}
                  cy={mol.y - mol.size / 6}
                  r={mol.size / 6}
                  fill="white"
                  opacity="0.3"
                />
              </g>
            ))}
          </svg>

          {/* Info overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 bg-blue-500/10 border border-blue-400/30 rounded text-xs text-blue-300">
            <Info className="h-3 w-3" />
            <span>Mutation clade</span>
          </div>

          {/* Stats overlay */}
          <div className="absolute bottom-3 right-3 space-y-1 text-xs">
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-blue-400">⚡</span>
              <span>5.1</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-purple-400">◉</span>
              <span>12.25</span>
              <span className="text-gray-500">df</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700/50">
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-400" />
              <span className="text-gray-400">
                <span className="text-white font-mono">14443.4</span>
                <span className="text-gray-500 ml-1">gg</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-400" />
              <span className="text-gray-400">
                <span className="text-white font-mono">9.3</span>
                <span className="text-gray-500 ml-1">dl</span>
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-right">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">
                Participant <span className="text-white">6.73</span>
                <span className="text-gray-500 ml-1">%</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">
                Allele frequency <span className="text-white">24/38</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">
                GWAS <span className="text-white">3.16</span>
                <span className="text-gray-500 ml-1">log</span>
              </span>
            </div>
          </div>
        </div>

        {/* Time indicator */}
        <div className="mt-3 text-xs text-gray-500">24h ago</div>

        {/* Progress bars */}
        <div className="mt-2 space-y-1">
          <div className="flex gap-1">
            <div className="h-1.5 flex-1 bg-blue-500 rounded" />
            <div className="h-1.5 w-8 bg-gray-700 rounded" />
            <div className="h-1.5 w-4 bg-purple-500 rounded" />
          </div>
          <div className="flex gap-1">
            <div className="h-1.5 flex-1 bg-linear-to-r from-blue-500 via-pink-500 to-blue-400 rounded" />
          </div>
          <div className="flex gap-1">
            <div className="h-1.5 flex-1 bg-linear-to-r from-blue-400 via-orange-400 to-gray-500 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
