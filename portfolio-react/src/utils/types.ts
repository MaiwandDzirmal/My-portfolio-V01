export type Coordinate = {
  x: number;
  y: number;
};

export const Direction = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
} as const;

export type Direction = (typeof Direction)[keyof typeof Direction];

export const CellType = {
  EMPTY: "empty",
  SNAKE_HEAD: "snake-head",
  SNAKE_BODY: "snake-body",
  FOOD: "food",
} as const;

export type CellType = (typeof CellType)[keyof typeof CellType];

export type FruitType =
  | "apple"
  | "banana"
  | "cherry"
  | "grape"
  | "orange"
  | "strawberry";

export type GameMode = "normal" | "no-walls" | "multiple-food" | "fast-mode";

export interface GameSettings {
  fruitType: FruitType;
  gameMode: GameMode;
  foodCount: number;
  boardSize: { width: number; height: number };
  snakeColor: string;
  gameSpeed: number;
}

export interface GameState {
  snake: Coordinate[];
  food: Coordinate[];
  direction: Direction;
  score: number;
  gameOver: boolean;
  gameStarted: boolean;
  boardSize: { width: number; height: number };
  settings: GameSettings;
}

export type GameAction =
  | { type: "CHANGE_DIRECTION"; payload: Direction }
  | { type: "TICK" }
  | { type: "RESET_GAME" }
  | { type: "START_GAME" }
  | { type: "GAME_OVER" }
  | { type: "UPDATE_SETTINGS"; payload: Partial<GameSettings> };
