import React from "react";

interface GameStatusProps {
  gameOver: boolean;
  gameStarted: boolean;
  onStartGame: () => void;
  onResetGame: () => void;
}

const GameStatus: React.FC<GameStatusProps> = ({
  gameOver,
  gameStarted,
  onStartGame,
  onResetGame,
}) => {
  return (
    <div style={{ textAlign: "center", margin: "20px 0" }}>
      {!gameStarted && !gameOver && (
        <button onClick={onStartGame} style={buttonStyle}>
          Start Game
        </button>
      )}
      {gameOver && (
        <>
          <p style={{ color: "red", fontSize: "1.8rem", fontWeight: "bold" }}>
            Game Over!
          </p>
          <button onClick={onResetGame} style={buttonStyle}>
            Play Again
          </button>
        </>
      )}
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  padding: "12px 24px",
  fontSize: "1.1rem",
  cursor: "pointer",
  backgroundColor: "var(--accent, #4caf50)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  margin: "5px",
  transition: "all 0.2s ease",
  boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
  fontWeight: "600",
};

export default GameStatus;
