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

  const handleGameModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mode = e.target.value as GameMode;
    onSettingsChange({
      gameMode: mode,
      foodCount: mode === "multiple-food" ? 3 : 1,
      gameSpeed: mode === "fast-mode" ? 80 : 150,
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
          <span>🎮 Game Mode:</span>
          <select value={settings.gameMode} onChange={handleGameModeChange}>
            <option value="normal">Normal</option>
            <option value="no-walls">No Walls</option>
            <option value="multiple-food">Multiple Food</option>
            <option value="fast-mode">Fast Mode</option>
          </select>
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
            disabled={settings.gameMode !== "multiple-food"}
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
