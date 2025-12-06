import React from "react";
import styles from "./Cell.module.css";
import { CellType, Direction } from "../../utils/types";
import type { FruitType } from "../../utils/types";

// Helper function to adjust color brightness
function adjustColorBrightness(color: string, percent: number): string {
  // Handle hex colors
  if (color.startsWith("#")) {
    const num = parseInt(color.replace("#", ""), 16);
    const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + percent));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + percent));
    const b = Math.max(0, Math.min(255, (num & 0xff) + percent));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  }
  // Handle rgb/rgba colors
  if (color.startsWith("rgb")) {
    const matches = color.match(/\d+/g);
    if (matches && matches.length >= 3) {
      const r = Math.max(0, Math.min(255, parseInt(matches[0]) + percent));
      const g = Math.max(0, Math.min(255, parseInt(matches[1]) + percent));
      const b = Math.max(0, Math.min(255, parseInt(matches[2]) + percent));
      if (matches.length === 4) {
        return `rgba(${r}, ${g}, ${b}, ${matches[3]})`;
      }
      return `rgb(${r}, ${g}, ${b})`;
    }
  }
  // Fallback: return original color
  return color;
}

// Helper function to convert hex color to rgba
function hexToRgba(hex: string, alpha: number): string {
  if (hex.startsWith("#")) {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = (num >> 16) & 0xff;
    const g = (num >> 8) & 0xff;
    const b = num & 0xff;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  // If already rgba/rgb, try to extract and add alpha
  if (hex.startsWith("rgb")) {
    const matches = hex.match(/\d+/g);
    if (matches && matches.length >= 3) {
      return `rgba(${matches[0]}, ${matches[1]}, ${matches[2]}, ${alpha})`;
    }
  }
  // Fallback
  return hex;
}

interface CellProps {
  type: CellType;
  fruitType?: FruitType;
  snakeColor?: string;
  direction?: Direction;
  isNearFood?: boolean;
  style?: React.CSSProperties;
}

const Cell: React.FC<CellProps> = ({
  type,
  fruitType = "apple",
  snakeColor,
  direction,
  isNearFood = false,
  style: externalStyle,
}) => {
  const cellClasses = [styles.cell, styles[type]];

  if (type === CellType.FOOD) {
    cellClasses.push(styles[`food-${fruitType}`]);
  }

  const style: React.CSSProperties = { ...externalStyle };
  if (
    (type === CellType.SNAKE_HEAD || type === CellType.SNAKE_BODY) &&
    snakeColor
  ) {
    // Use background instead of backgroundColor to override CSS gradients
    // Create a slightly darker shade for the gradient effect
    const darkerShade = adjustColorBrightness(snakeColor, -15);
    style.background = `linear-gradient(135deg, ${snakeColor} 0%, ${darkerShade} 100%)`;
    if (type === CellType.SNAKE_HEAD) {
      style.boxShadow = `0 0 10px ${snakeColor}, inset 0 0 10px rgba(255, 255, 255, 0.2)`;
    } else {
      // Convert color to rgba for box shadow with transparency
      const shadowColor = hexToRgba(snakeColor, 0.25);
      style.boxShadow = `0 0 5px ${shadowColor}`;
    }
  }

  const tongueDirection = direction || Direction.RIGHT;
  const directionClass =
    type === CellType.SNAKE_HEAD
      ? styles[`tongue-${tongueDirection.toLowerCase()}`]
      : "";
  const tongueClass = `${styles.snakeTongue} ${
    styles[`tongue-${tongueDirection.toLowerCase()}`]
  } ${isNearFood ? styles.tongueExtended : ""}`;
  const headClass =
    type === CellType.SNAKE_HEAD
      ? `${cellClasses.join(" ")} ${
          isNearFood ? styles.mouthOpen : ""
        } ${directionClass}`
      : cellClasses.join(" ");

  return (
    <div className={headClass} style={style}>
      {type === CellType.SNAKE_HEAD && (
        <>
          <div className={styles.snakeCheekLeft}></div>
          <div className={styles.snakeCheekRight}></div>
          <div className={styles.snakeSmile}></div>
          <div className={styles.eyeShineLeft}></div>
          <div className={styles.eyeShineRight}></div>
          <div className={styles.snakeMouth}></div>
          <div className={tongueClass}>
            <span></span>
            <span></span>
          </div>
        </>
      )}
    </div>
  );
};

export default Cell;
