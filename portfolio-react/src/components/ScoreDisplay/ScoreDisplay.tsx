import React from "react";

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  return (
    <div className="score-display">
      <span className="score-label">Score:</span>
      <span className="score-value">{score}</span>
    </div>
  );
};

export default ScoreDisplay;
