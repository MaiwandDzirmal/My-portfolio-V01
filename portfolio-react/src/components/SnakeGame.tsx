import React, { useEffect, useReducer, useCallback, useState } from "react";
import Board from "./Board/Board";
import ScoreDisplay from "./ScoreDisplay/ScoreDisplay";
import GameStatus from "./GameStatus/GameStatus";
import Settings from "./Settings/Settings";
import { useGameLoop } from "../hooks/useGameLoop";
import {
  gameReducer,
  initializeGameState,
  DEFAULT_SETTINGS,
} from "../utils/gameLogic";
import { Direction } from "../utils/types";

const SnakeGame: React.FC = () => {
  const [state, dispatch] = useReducer(
    gameReducer,
    initializeGameState(DEFAULT_SETTINGS)
  );
  const { snake, food, score, gameOver, gameStarted, boardSize, settings } =
    state;
  const [showSettings, setShowSettings] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  // Game loop with dynamic speed
  useGameLoop({
    callback: () => dispatch({ type: "TICK" }),
    delay: settings.gameSpeed,
    enabled: gameStarted && !gameOver,
  });

  // Keyboard input handler
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!gameStarted && event.key === "Enter") {
        dispatch({ type: "START_GAME" });
        return;
      }
      if (gameOver && event.key === "Enter") {
        dispatch({ type: "RESET_GAME" });
        dispatch({ type: "START_GAME" });
        return;
      }
      if (event.key === "Escape" || event.key === "Escape") {
        setShowSettings(!showSettings);
        return;
      }

      let newDirection: Direction | null = null;
      switch (event.key) {
        case "ArrowUp":
        case "w":
        case "W":
          newDirection = Direction.UP;
          break;
        case "ArrowDown":
        case "s":
        case "S":
          newDirection = Direction.DOWN;
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          newDirection = Direction.LEFT;
          break;
        case "ArrowRight":
        case "d":
        case "D":
          newDirection = Direction.RIGHT;
          break;
        case " ":
          event.preventDefault();
          break;
      }

      if (newDirection !== null) {
        dispatch({ type: "CHANGE_DIRECTION", payload: newDirection });
      }
    },
    [gameStarted, gameOver, showSettings]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleStartGame = useCallback(() => {
    dispatch({ type: "START_GAME" });
  }, []);

  const handleResetGame = useCallback(() => {
    dispatch({ type: "RESET_GAME" });
  }, []);

  const handleSettingsChange = useCallback(
    (newSettings: Partial<typeof localSettings>) => {
      setLocalSettings((prev) => ({ ...prev, ...newSettings }));
    },
    []
  );

  const handleApplySettings = useCallback(() => {
    dispatch({ type: "UPDATE_SETTINGS", payload: localSettings });
    dispatch({ type: "RESET_GAME" });
    setShowSettings(false);
  }, [localSettings]);

  const handleCancelSettings = useCallback(() => {
    setLocalSettings(settings);
    setShowSettings(false);
  }, [settings]);

  // Sync local settings when game settings change
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  return (
    <div className="snake-game-container">
      <div className="snake-game-header">
        <h2 className="snake-game-title">🐍 Snake Game</h2>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <ScoreDisplay score={score} />
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="snake-settings-button"
            type="button"
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {showSettings && (
        <Settings
          settings={localSettings}
          onSettingsChange={handleSettingsChange}
          onApply={handleApplySettings}
          onCancel={handleCancelSettings}
        />
      )}

      <GameStatus
        gameOver={gameOver}
        gameStarted={gameStarted}
        onStartGame={handleStartGame}
        onResetGame={handleResetGame}
      />
      <div className="snake-game-board-wrapper">
        <Board
          snake={snake}
          food={food}
          boardSize={boardSize}
          fruitType={settings.fruitType}
          snakeColor={settings.snakeColor}
        />
      </div>
      <div className="snake-game-instructions">
        <p>Use Arrow Keys or WASD to move</p>
        <p>Press Enter to start/reset | ESC for settings</p>
      </div>
    </div>
  );
};

export default SnakeGame;
