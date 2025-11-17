import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MemoryMatch from "../components/MemoryMatch";

type GameMode = "1player" | "2players" | null;
type CardType = "icons" | "numbers" | null;
type GridSize = "4x4" | "8x8" | "10x10" | null;

export default function MemoryMatchPage() {
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [cardType, setCardType] = useState<CardType>(null);
  const [gridSize, setGridSize] = useState<GridSize>(null);
  const navigate = useNavigate();

  const handleModeSelect = (mode: "1player" | "2players") => {
    setGameMode(mode);
  };

  const handleCardTypeSelect = (type: "icons" | "numbers") => {
    setCardType(type);
  };

  const handleGridSizeSelect = (size: "4x4" | "8x8" | "10x10") => {
    setGridSize(size);
  };

  const handleBack = () => {
    setGameMode(null);
    setCardType(null);
    setGridSize(null);
    navigate("/games");
  };

  if (gameMode === null) {
    return (
      <div className="page memory-match-page">
        <section className="page-hero">
          <h1>Memory Match Game</h1>
          <p>Choose your game mode to start playing!</p>
        </section>

        <section className="card game-mode-selection">
          <div className="game-mode-buttons">
            <button
              className="cta primary large"
              onClick={() => handleModeSelect("1player")}
              type="button"
            >
              1 Player
            </button>
            <button
              className="cta primary large"
              onClick={() => handleModeSelect("2players")}
              type="button"
            >
              2 Players
            </button>
          </div>
          <button className="cta tertiary" onClick={handleBack} type="button">
            Back to Games
          </button>
        </section>
      </div>
    );
  }

  if (cardType === null) {
    return (
      <div className="page memory-match-page">
        <section className="page-hero">
          <h1>Memory Match Game</h1>
          <p>Choose your card type!</p>
        </section>

        <section className="card card-type-selection">
          <div className="game-mode-buttons">
            <button
              className="cta primary large"
              onClick={() => handleCardTypeSelect("numbers")}
              type="button"
            >
              Numbers
            </button>
            <button
              className="cta primary large"
              onClick={() => handleCardTypeSelect("icons")}
              type="button"
            >
              Icons
            </button>
          </div>
          <button
            className="cta tertiary"
            onClick={() => setGameMode(null)}
            type="button"
          >
            Back
          </button>
        </section>
      </div>
    );
  }

  if (gridSize === null) {
    return (
      <div className="page memory-match-page">
        <section className="page-hero">
          <h1>Memory Match Game</h1>
          <p>Choose your grid size!</p>
        </section>

        <section className="card grid-size-selection">
          <div className="game-mode-buttons">
            <button
              className="cta primary large"
              onClick={() => handleGridSizeSelect("4x4")}
              type="button"
            >
              4x4 (Easy)
            </button>
            <button
              className="cta primary large"
              onClick={() => handleGridSizeSelect("8x8")}
              type="button"
            >
              8x8 (Medium)
            </button>
            <button
              className="cta primary large"
              onClick={() => handleGridSizeSelect("10x10")}
              type="button"
            >
              10x10 (Hard)
            </button>
          </div>
          <button
            className="cta tertiary"
            onClick={() => setCardType(null)}
            type="button"
          >
            Back
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="page memory-match-page">
      <section className="page-hero">
        <h1>Memory Match Game</h1>
        <p>
          {gameMode === "1player"
            ? "Test your memory skills!"
            : "Take turns with a friend to find matching pairs!"}
        </p>
      </section>

      <section className="card memory-match-game-wrapper">
        <div className="memory-match-controls">
          <button
            className="cta tertiary"
            onClick={() => setGridSize(null)}
            type="button"
          >
            Change Grid Size
          </button>
          <button
            className="cta tertiary"
            onClick={() => setCardType(null)}
            type="button"
          >
            Change Card Type
          </button>
          <button
            className="cta tertiary"
            onClick={() => {
              setGameMode(null);
              setCardType(null);
              setGridSize(null);
            }}
            type="button"
          >
            Change Mode
          </button>
          <button className="cta tertiary" onClick={handleBack} type="button">
            Back to Games
          </button>
        </div>
        <MemoryMatch
          gameMode={gameMode}
          cardType={cardType}
          gridSize={gridSize}
        />
      </section>
    </div>
  );
}
