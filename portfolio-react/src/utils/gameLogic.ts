import { Direction } from "./types";
import type { Coordinate, GameState, GameAction, GameSettings } from "./types";
import { soundManager } from "./soundManager";

export const DEFAULT_BOARD_SIZE = { width: 20, height: 20 };
export const INITIAL_SNAKE_LENGTH = 3;

export const DEFAULT_SETTINGS: GameSettings = {
  fruitType: "apple",
  gameMode: ["normal"],
  foodCount: 1,
  boardSize: DEFAULT_BOARD_SIZE,
  snakeColor: "#4caf50",
  gameSpeed: 150,
  soundEnabled: true,
  soundVolume: 0.5,
};

/**
 * Initializes the game state.
 */
export function initializeGameState(
  settings: GameSettings = DEFAULT_SETTINGS
): GameState {
  const head: Coordinate = {
    x: Math.floor(settings.boardSize.width / 2),
    y: Math.floor(settings.boardSize.height / 2),
  };
  const snake: Coordinate[] = [];
  for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
    snake.push({ x: head.x - i, y: head.y });
  }

  const food = generateFoodPositions(snake, settings);

  return {
    snake,
    food,
    direction: Direction.RIGHT,
    score: 0,
    gameOver: false,
    gameStarted: false,
    boardSize: settings.boardSize,
    settings,
  };
}

/**
 * Generates random food positions that are not occupied by the snake.
 */
export function generateFoodPositions(
  snake: Coordinate[],
  settings: GameSettings,
  count?: number,
  existingFood: Coordinate[] = []
): Coordinate[] {
  const foods: Coordinate[] = [];
  const occupiedCells = new Set(
    snake.map((segment) => `${segment.x},${segment.y}`)
  );

  // Also mark existing food positions as occupied
  existingFood.forEach((f) => {
    occupiedCells.add(`${f.x},${f.y}`);
  });

  const foodCount =
    count !== undefined
      ? count
      : settings.gameMode.includes("multiple-food")
      ? settings.foodCount
      : 1;

  for (let i = 0; i < foodCount; i++) {
    let attempts = 0;
    let food: Coordinate;

    while (attempts < 1000) {
      food = {
        x: Math.floor(Math.random() * settings.boardSize.width),
        y: Math.floor(Math.random() * settings.boardSize.height),
      };
      const foodKey = `${food.x},${food.y}`;
      if (
        !occupiedCells.has(foodKey) &&
        !foods.some((f) => `${f.x},${f.y}` === foodKey)
      ) {
        foods.push(food);
        break;
      }
      attempts++;
    }
  }

  return foods;
}

/**
 * Calculates the next head position based on current direction.
 */
export function getNextHeadPosition(
  currentHead: Coordinate,
  direction: Direction,
  boardSize: { width: number; height: number },
  gameMode: string | string[]
): Coordinate {
  let newHead = { ...currentHead };
  switch (direction) {
    case Direction.UP:
      newHead.y--;
      break;
    case Direction.DOWN:
      newHead.y++;
      break;
    case Direction.LEFT:
      newHead.x--;
      break;
    case Direction.RIGHT:
      newHead.x++;
      break;
  }

  // Handle wrapping in no-walls mode
  if (
    Array.isArray(gameMode)
      ? gameMode.includes("no-walls")
      : gameMode === "no-walls"
  ) {
    if (newHead.x < 0) newHead.x = boardSize.width - 1;
    if (newHead.x >= boardSize.width) newHead.x = 0;
    if (newHead.y < 0) newHead.y = boardSize.height - 1;
    if (newHead.y >= boardSize.height) newHead.y = 0;
  }

  return newHead;
}

/**
 * Checks for collisions with walls or self.
 */
export function checkCollision(
  newHead: Coordinate,
  snakeBody: Coordinate[],
  boardSize: { width: number; height: number },
  gameMode: string | string[]
): boolean {
  // Wall collision (skip if no-walls mode)
  const isNoWalls = Array.isArray(gameMode)
    ? gameMode.includes("no-walls")
    : gameMode === "no-walls";
  if (!isNoWalls) {
    if (
      newHead.x < 0 ||
      newHead.x >= boardSize.width ||
      newHead.y < 0 ||
      newHead.y >= boardSize.height
    ) {
      return true;
    }
  }

  // Self collision
  for (let i = 1; i < snakeBody.length; i++) {
    if (snakeBody[i].x === newHead.x && snakeBody[i].y === newHead.y) {
      return true;
    }
  }

  return false;
}

/**
 * Reducer function for managing game state.
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
      soundManager.setEnabled(state.settings.soundEnabled);
      soundManager.setVolume(state.settings.soundVolume);
      soundManager.play("start");
      return { ...state, gameStarted: true, gameOver: false };
    case "RESET_GAME":
      return initializeGameState(state.settings);
    case "RESET_AND_START_GAME":
      const resetState = initializeGameState(state.settings);
      soundManager.setEnabled(resetState.settings.soundEnabled);
      soundManager.setVolume(resetState.settings.soundVolume);
      soundManager.play("start");
      return { ...resetState, gameStarted: true, gameOver: false };
    case "GAME_OVER":
      return { ...state, gameOver: true, gameStarted: false };
    case "UPDATE_SETTINGS":
      const newSettings = { ...state.settings, ...action.payload };
      soundManager.setEnabled(newSettings.soundEnabled);
      soundManager.setVolume(newSettings.soundVolume);
      return {
        ...state,
        settings: newSettings,
        boardSize: newSettings.boardSize,
      };
    case "CHANGE_DIRECTION":
      if (
        (action.payload === Direction.UP &&
          state.direction === Direction.DOWN) ||
        (action.payload === Direction.DOWN &&
          state.direction === Direction.UP) ||
        (action.payload === Direction.LEFT &&
          state.direction === Direction.RIGHT) ||
        (action.payload === Direction.RIGHT &&
          state.direction === Direction.LEFT)
      ) {
        return state;
      }
      return { ...state, direction: action.payload };

    case "TICK":
      if (state.gameOver || !state.gameStarted) {
        return state;
      }

      const currentHead = state.snake[0];
      const newHead = getNextHeadPosition(
        currentHead,
        state.direction,
        state.boardSize,
        state.settings.gameMode
      );

      if (
        checkCollision(
          newHead,
          state.snake,
          state.boardSize,
          state.settings.gameMode
        )
      ) {
        soundManager.play("gameOver");
        return { ...state, gameOver: true, gameStarted: false };
      }

      const newSnake = [newHead, ...state.snake];
      let newFood = [...state.food];
      let newScore = state.score;

      // Check if any food is eaten
      const eatenFoodIndex = newFood.findIndex(
        (f) => f.x === newHead.x && f.y === newHead.y
      );

      if (eatenFoodIndex !== -1) {
        newFood.splice(eatenFoodIndex, 1);
        newScore++;
        soundManager.play("eat");

        // Generate 1 replacement food (pass existing food to avoid overlap)
        const replacementFoods = generateFoodPositions(
          newSnake,
          state.settings,
          1,
          newFood
        );
        newFood.push(...replacementFoods);
      } else {
        newSnake.pop();
      }

      return {
        ...state,
        snake: newSnake,
        food: newFood,
        score: newScore,
      };
    default:
      return state;
  }
}
