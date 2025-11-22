import React from "react";
import styles from "./Board.module.css";
import Cell from "../Cell/Cell";
import { CellType } from "../../utils/types";
import type { Coordinate, FruitType } from "../../utils/types";

interface BoardProps {
  snake: Coordinate[];
  food: Coordinate[];
  boardSize: { width: number; height: number };
  fruitType: FruitType;
  snakeColor: string;
}

const Board: React.FC<BoardProps> = ({
  snake,
  food,
  boardSize,
  fruitType,
  snakeColor,
}) => {
  // Ensure boardSize is valid
  const width = Math.max(1, boardSize?.width || 20);
  const height = Math.max(1, boardSize?.height || 20);

  // Create a 2D array representing the board
  const grid: CellType[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => CellType.EMPTY)
  );

  // Mark snake head
  if (snake && snake.length > 0 && snake[0]) {
    const head = snake[0];
    if (head && typeof head.y === "number" && typeof head.x === "number") {
      if (head.y >= 0 && head.y < height && head.x >= 0 && head.x < width) {
        grid[head.y][head.x] = CellType.SNAKE_HEAD;
      }
    }
  }

  // Mark snake body
  if (snake && Array.isArray(snake)) {
    for (let i = 1; i < snake.length; i++) {
      const segment = snake[i];
      if (
        segment &&
        typeof segment.y === "number" &&
        typeof segment.x === "number"
      ) {
        if (
          segment.y >= 0 &&
          segment.y < height &&
          segment.x >= 0 &&
          segment.x < width
        ) {
          grid[segment.y][segment.x] = CellType.SNAKE_BODY;
        }
      }
    }
  }

  // Mark food (can be multiple)
  if (food && Array.isArray(food)) {
    food.forEach((f) => {
      if (f && typeof f.y === "number" && typeof f.x === "number") {
        if (f.y >= 0 && f.y < height && f.x >= 0 && f.x < width) {
          grid[f.y][f.x] = CellType.FOOD;
        }
      }
    });
  }

  return (
    <div
      className={styles.board}
      style={{
        gridTemplateColumns: `repeat(${width}, 1fr)`,
        gridTemplateRows: `repeat(${height}, 1fr)`,
      }}
    >
      {grid.map((row, y) =>
        row.map((cellType, x) => (
          <Cell
            key={`${x}-${y}`}
            type={cellType}
            fruitType={fruitType}
            snakeColor={snakeColor}
          />
        ))
      )}
    </div>
  );
};

export default Board;
