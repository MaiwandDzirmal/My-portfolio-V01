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
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [playerNamesSubmitted, setPlayerNamesSubmitted] = useState(false);
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

  // For 2-player mode, collect player names before grid size
  if (gameMode === "2players" && !playerNamesSubmitted) {
    return (
      <div className="page memory-match-page">
        <section className="page-hero">
          <h1>Memory Match Game</h1>
          <p>Enter player names!</p>
        </section>

        <section className="card player-names-selection">
          <div className="player-names-form">
            <div className="player-input-group">
              <label htmlFor="player1">Player 1 Name:</label>
              <input
                id="player1"
                type="text"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
                onKeyDown={(e) => {
                  // Prevent any form submission on Enter
                  if (e.key === "Enter") {
                    e.preventDefault();
                    // Just focus on player2 input, don't submit
                    document.getElementById("player2")?.focus();
                  }
                }}
                placeholder="Enter Player 1 name"
                maxLength={20}
                autoFocus
              />
            </div>
            <div className="player-input-group">
              <label htmlFor="player2">Player 2 Name:</label>
              <input
                id="player2"
                type="text"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                onKeyDown={(e) => {
                  // Prevent any form submission on Enter - only button can submit
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    // Don't do anything, just prevent default
                  }
                }}
                placeholder="Enter Player 2 name"
                maxLength={20}
              />
            </div>
            <div className="player-names-actions">
              <button
                type="button"
                className="cta primary"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Only proceed if both names are filled
                  if (player1Name.trim() && player2Name.trim()) {
                    setPlayerNamesSubmitted(true);
                    handleCardTypeSelect(cardType || "numbers");
                  }
                }}
                disabled={!player1Name.trim() || !player2Name.trim()}
              >
                Continue
              </button>
              <button
                type="button"
                className="cta tertiary"
                onClick={() => {
                  setGameMode(null);
                  setPlayer1Name("");
                  setPlayer2Name("");
                  setPlayerNamesSubmitted(false);
                }}
              >
                Back
              </button>
            </div>
          </div>
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
            onClick={() => {
              setCardType(null);
              if (gameMode === "2players") {
                setPlayer1Name("");
                setPlayer2Name("");
                setPlayerNamesSubmitted(false);
              }
            }}
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
              setPlayer1Name("");
              setPlayer2Name("");
              setPlayerNamesSubmitted(false);
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
          player1Name={gameMode === "2players" ? player1Name : undefined}
          player2Name={gameMode === "2players" ? player2Name : undefined}
        />
      </section>
    </div>
  );
}
