import React from "react";
import styles from "./Cell.module.css";
import { CellType } from "../../utils/types";
import type { FruitType } from "../../utils/types";

interface CellProps {
  type: CellType;
  fruitType?: FruitType;
  snakeColor?: string;
}

const Cell: React.FC<CellProps> = ({
  type,
  fruitType = "apple",
  snakeColor,
}) => {
  const cellClasses = [styles.cell, styles[type]];

  if (type === CellType.FOOD) {
    cellClasses.push(styles[`food-${fruitType}`]);
  }

  const style: React.CSSProperties = {};
  if (
    (type === CellType.SNAKE_HEAD || type === CellType.SNAKE_BODY) &&
    snakeColor
  ) {
    style.backgroundColor = snakeColor;
    if (type === CellType.SNAKE_HEAD) {
      style.boxShadow = `0 0 10px ${snakeColor}, inset 0 0 10px rgba(255, 255, 255, 0.2)`;
    }
  }

  return <div className={cellClasses.join(" ")} style={style}></div>;
};

export default Cell;
