import React from "react";
import type { GameSettings, FruitType, GameMode } from "../../utils/types";
import styles from "./Settings.module.css";

interface SettingsProps {
  settings: GameSettings;
  onSettingsChange: (settings: Partial<GameSettings>) => void;
  onApply: () => void;
  onCancel: () => void;
}

const FRUIT_TYPES: FruitType[] = [
  "apple",
  "banana",
  "cherry",
  "grape",
  "orange",
  "strawberry",
];

const Settings: React.FC<SettingsProps> = ({
  settings,
  onSettingsChange,
  onApply,
  onCancel,
}) => {
  const handleFruitTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSettingsChange({ fruitType: e.target.value as FruitType });
  };

  const handleGameModeToggle = (mode: GameMode) => {
    const currentModes = settings.gameMode;
    const isActive = currentModes.includes(mode);

    let newModes: GameMode[];
    if (isActive) {
      // Remove mode, but ensure at least one mode is selected
      newModes = currentModes.filter((m) => m !== mode);
      if (newModes.length === 0) {
        newModes = ["normal"];
      }
    } else {
      // Add mode
      newModes = [...currentModes, mode];
    }

    // Update related settings based on active modes
    const hasMultipleFood = newModes.includes("multiple-food");
    const hasFastMode = newModes.includes("fast-mode");
    const wasFastMode = currentModes.includes("fast-mode");

    // Smart speed handling: only change speed if fast-mode state changed
    let newSpeed = settings.gameSpeed;
    if (mode === "fast-mode") {
      if (hasFastMode && !wasFastMode) {
        // Fast-mode just enabled
        newSpeed = 80;
      } else if (!hasFastMode && wasFastMode) {
        // Fast-mode just disabled, reset to default if it was at fast speed
        if (settings.gameSpeed <= 90) {
          newSpeed = 150;
        }
      }
    }

    onSettingsChange({
      gameMode: newModes,
      foodCount: hasMultipleFood ? Math.max(settings.foodCount, 3) : 1,
      gameSpeed: newSpeed,
    });
  };

  const handleFoodCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ foodCount: Number(e.target.value) });
  };

  const handleGridSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = Number(e.target.value);
    onSettingsChange({
      boardSize: { width: size, height: size },
    });
  };

  const handleSnakeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ snakeColor: e.target.value });
  };

  const handleGameSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ gameSpeed: Number(e.target.value) });
  };

  return (
    <div className={styles.settingsPanel}>
      <h3 className={styles.title}>⚙️ Game Settings</h3>

      <div className={styles.settingGroup}>
        <label>
          <span>🍎 Fruit Type:</span>
          <select value={settings.fruitType} onChange={handleFruitTypeChange}>
            {FRUIT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.settingGroup}>
        <label>
          <span>🎮 Game Modes (Select Multiple):</span>
          <div className={styles.gameModeButtons}>
            {(
              ["normal", "no-walls", "multiple-food", "fast-mode"] as GameMode[]
            ).map((mode) => {
              const isActive = settings.gameMode.includes(mode);
              return (
                <button
                  key={mode}
                  type="button"
                  className={`${styles.gameModeButton} ${
                    isActive ? styles.active : ""
                  }`}
                  onClick={() => handleGameModeToggle(mode)}
                >
                  {mode === "normal" && "🎯"}
                  {mode === "no-walls" && "🌐"}
                  {mode === "multiple-food" && "🍎"}
                  {mode === "fast-mode" && "⚡"}{" "}
                  {mode === "normal"
                    ? "Normal"
                    : mode === "no-walls"
                    ? "No Walls"
                    : mode === "multiple-food"
                    ? "Multiple Food"
                    : "Fast Mode"}
                </button>
              );
            })}
          </div>
        </label>
      </div>

      <div className={styles.settingGroup}>
        <label>
          <span>🍎 Food Count: {settings.foodCount}</span>
          <input
            type="range"
            min="1"
            max="5"
            value={settings.foodCount}
            onChange={handleFoodCountChange}
            disabled={!settings.gameMode.includes("multiple-food")}
          />
        </label>
      </div>

      <div className={styles.settingGroup}>
        <label>
          <span>
            📐 Grid Size: {settings.boardSize.width}x{settings.boardSize.height}
          </span>
          <input
            type="range"
            min="10"
            max="25"
            value={settings.boardSize.width}
            onChange={handleGridSizeChange}
          />
        </label>
      </div>

      <div className={styles.settingGroup}>
        <label>
          <span>🐍 Snake Color:</span>
          <input
            type="color"
            value={settings.snakeColor}
            onChange={handleSnakeColorChange}
          />
        </label>
      </div>

      <div className={styles.settingGroup}>
        <label>
          <span>⚡ Game Speed: {settings.gameSpeed}ms</span>
          <input
            type="range"
            min="50"
            max="300"
            step="10"
            value={settings.gameSpeed}
            onChange={handleGameSpeedChange}
          />
        </label>
      </div>

      <div className={styles.actions}>
        <button className={styles.applyButton} onClick={onApply}>
          ▶️ Play
        </button>
        <button className={styles.cancelButton} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Settings;
