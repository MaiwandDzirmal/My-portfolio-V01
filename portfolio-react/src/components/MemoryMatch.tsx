import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Star,
  Moon,
  Sun,
  Zap,
  Flower,
  Music,
  Gamepad2,
  Coffee,
  Rocket,
  Camera,
  Gift,
  Bell,
  Book,
  Car,
  Cat,
  Dog,
  Fish,
  Flag,
  Gem,
  Home,
  Key,
  Lightbulb,
  Mail,
  Map,
  Palette,
  Plane,
  Shield,
  Smile,
  Trees,
  Umbrella,
  Apple,
  Award,
  Banana,
  Battery,
  Bike,
  Bird,
  Bug,
  Cake,
  Cloud,
  Crown,
  Diamond,
  Eye,
  Flame,
  Ghost,
  Globe,
  Hammer,
  Headphones,
  IceCream,
  Image,
  Infinity,
  Laptop,
  Leaf,
  Lock,
  Magnet,
  Mic,
  Mountain,
  Mouse,
  Pizza,
  Rainbow,
  Scissors,
  Search,
  Settings,
  ShoppingBag,
  Snowflake,
  Sparkles,
  Target,
  Trophy,
  Watch,
  Wifi,
  type LucideIcon,
} from "lucide-react";

type Card = {
  id: number;
  value: number;
  flipped: boolean;
  matched: boolean;
};

type MemoryMatchProps = {
  gameMode?: "1player" | "2players";
  cardType?: "icons" | "numbers";
  gridSize?: "4x4" | "8x8" | "10x10";
};

// Grid size configurations
const GRID_SIZES = {
  "4x4": { pairs: 8, cols: 4 },
  "8x8": { pairs: 32, cols: 8 },
  "10x10": { pairs: 50, cols: 10 },
} as const;

// Icon mapping for each card value (supports up to 70+ unique icons)
const CARD_ICONS: LucideIcon[] = [
  Heart,
  Star,
  Moon,
  Sun,
  Zap,
  Flower,
  Music,
  Gamepad2,
  Coffee,
  Rocket,
  Camera,
  Gift,
  Bell,
  Book,
  Car,
  Cat,
  Dog,
  Fish,
  Flag,
  Gem,
  Home,
  Key,
  Lightbulb,
  Mail,
  Map,
  Palette,
  Plane,
  Shield,
  Smile,
  Trees,
  Umbrella,
  Apple,
  Award,
  Banana,
  Battery,
  Bike,
  Bird,
  Bug,
  Cake,
  Cloud,
  Crown,
  Diamond,
  Eye,
  Flame,
  Ghost,
  Globe,
  Hammer,
  Headphones,
  IceCream,
  Image,
  Infinity,
  Laptop,
  Leaf,
  Lock,
  Magnet,
  Mic,
  Mountain,
  Mouse,
  Pizza,
  Rainbow,
  Scissors,
  Search,
  Settings,
  ShoppingBag,
  Snowflake,
  Sparkles,
  Target,
  Trophy,
  Watch,
  Wifi,
];

// Centralized color configuration for card icons
const CARD_COLORS: string[] = [
  "#ef4444", // Red
  "#fbbf24", // Amber
  "#6366f1", // Indigo
  "#f59e0b", // Orange
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#10b981", // Green
  "#3b82f6", // Blue
  "#dc2626", // Red-600
  "#ea580c", // Orange-600
  "#ca8a04", // Yellow-600
  "#65a30d", // Lime-600
  "#059669", // Emerald-600
  "#0891b2", // Cyan-600
  "#0284c7", // Sky-600
  "#2563eb", // Blue-600
  "#7c3aed", // Violet-600
  "#c026d3", // Fuchsia-600
  "#db2777", // Pink-600
  "#e11d48", // Rose-600
  "#f97316", // Orange-500
  "#eab308", // Yellow-500
  "#84cc16", // Lime-500
  "#22c55e", // Green-500
  "#14b8a6", // Teal-500
  "#06b6d4", // Cyan-500
  "#0ea5e9", // Sky-500
  "#3b82f6", // Blue-500
  "#8b5cf6", // Violet-500
  "#a855f7", // Purple-500
  "#d946ef", // Fuchsia-500
  "#ec4899", // Pink-500
];

// Helper function to get icon for a card value (ensures each pair gets unique icon)
const getIcon = (value: number): LucideIcon => {
  // If we have enough icons, use unique one for each value
  // Otherwise cycle through available icons
  const iconIndex =
    value <= CARD_ICONS.length ? value - 1 : (value - 1) % CARD_ICONS.length;
  return CARD_ICONS[iconIndex];
};

// Helper function to get color for a card value (cycles through available colors)
const getColor = (value: number): string => {
  return CARD_COLORS[(value - 1) % CARD_COLORS.length];
};

// LocalStorage keys for best scores (grid-size specific)
const getStorageKey = (
  gridSize: "4x4" | "8x8" | "10x10",
  type: "moves" | "time"
) => `memory-match-${gridSize}-best-${type}`;

// Utility functions for localStorage (grid-size specific)
const getBestMoves = (gridSize: "4x4" | "8x8" | "10x10"): number | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(
      getStorageKey(gridSize, "moves")
    );
    return stored ? parseInt(stored, 10) : null;
  } catch {
    return null;
  }
};

const getBestTime = (gridSize: "4x4" | "8x8" | "10x10"): number | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(getStorageKey(gridSize, "time"));
    return stored ? parseInt(stored, 10) : null;
  } catch {
    return null;
  }
};

const setBestMoves = (
  gridSize: "4x4" | "8x8" | "10x10",
  moves: number
): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      getStorageKey(gridSize, "moves"),
      String(moves)
    );
  } catch {
    // Ignore storage errors
  }
};

const setBestTime = (gridSize: "4x4" | "8x8" | "10x10", time: number): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(getStorageKey(gridSize, "time"), String(time));
  } catch {
    // Ignore storage errors
  }
};

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const createNewGame = (gridSize: "4x4" | "8x8" | "10x10"): Card[] => {
  const { pairs } = GRID_SIZES[gridSize];
  // Create pairs of cards (1 to pairs, each appearing twice)
  const cardValues: number[] = [];
  for (let i = 1; i <= pairs; i++) {
    cardValues.push(i, i);
  }
  // Shuffle the cards using Fisher-Yates
  const shuffled = shuffleArray(cardValues);

  // Create new cards with all face down and unmatched
  return shuffled.map((value, index) => ({
    id: index,
    value,
    flipped: false,
    matched: false,
  }));
};

export default function MemoryMatch({
  gameMode,
  cardType = "numbers",
  gridSize = "4x4",
}: MemoryMatchProps) {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>(() => createNewGame(gridSize));
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const timerRef = useRef<number | undefined>(undefined);

  // Initialize game function
  const initializeGame = () => {
    console.log("Initializing new game...");

    // Clear any existing timer first
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }

    // Create new game
    const newCards = createNewGame(gridSize);

    // Reset all state
    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setGameWon(false);
    setIsChecking(false);
    setGameStarted(false);
    setElapsedTime(0);
    setProgressMessage(null);

    console.log("New game initialized with", newCards.length, "cards");
  };

  // Timer effect
  useEffect(() => {
    if (gameStarted && !gameWon) {
      timerRef.current = window.setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = undefined;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, [gameStarted, gameWon]);

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2 && !isChecking) {
      setIsChecking(true);
      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.value === secondCard.value) {
        // Match found - wait 1 second before marking as matched so user can see the pair
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, matched: true, flipped: true }
                : card
            )
          );
          setFlippedCards([]);
          setMoves((prev) => prev + 1);
          setIsChecking(false);
        }, 1000);
      } else {
        // No match - show both cards for 1 second, then flip back
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              flippedCards.includes(card.id) && !card.matched
                ? { ...card, flipped: false }
                : card
            )
          );
          setFlippedCards([]);
          setMoves((prev) => prev + 1);
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [flippedCards, cards, isChecking]);

  // Check for win condition and track progress
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.matched) && !gameWon) {
      setGameWon(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = undefined;
      }

      // Check progress against best scores
      const bestMoves = getBestMoves(gridSize);
      const bestTime = getBestTime(gridSize);
      const improvements: string[] = [];
      let isNewRecord = false;

      // Check moves progress
      if (bestMoves === null || moves < bestMoves) {
        if (bestMoves !== null) {
          improvements.push(`Fewer moves! (${bestMoves} → ${moves})`);
        }
        setBestMoves(gridSize, moves);
        isNewRecord = true;
      } else if (moves > bestMoves) {
        improvements.push(`More moves than best (${bestMoves})`);
      }

      // Check time progress
      if (bestTime === null || elapsedTime < bestTime) {
        if (bestTime !== null) {
          improvements.push(
            `Faster time! (${formatTime(bestTime)} → ${formatTime(
              elapsedTime
            )})`
          );
        }
        setBestTime(gridSize, elapsedTime);
        isNewRecord = true;
      } else if (elapsedTime > bestTime) {
        improvements.push(`Slower than best time (${formatTime(bestTime)})`);
      }

      // Set progress message
      if (isNewRecord && (bestMoves !== null || bestTime !== null)) {
        setProgressMessage(`🎯 New record! ${improvements.join(", ")}`);
      } else if (bestMoves === null && bestTime === null) {
        setProgressMessage("🎉 First game completed! Great start!");
      } else if (
        bestMoves !== null &&
        bestTime !== null &&
        moves === bestMoves &&
        elapsedTime === bestTime
      ) {
        setProgressMessage("✨ Tied your best score! Keep it up!");
      } else if (
        bestMoves !== null &&
        bestTime !== null &&
        moves <= bestMoves &&
        elapsedTime <= bestTime
      ) {
        setProgressMessage("👍 Good game! You're maintaining your best!");
      } else {
        setProgressMessage(
          `📊 Progress: ${
            improvements.length > 0
              ? improvements.join(", ")
              : "Keep practicing!"
          }`
        );
      }
    }
  }, [cards, gameWon, moves, elapsedTime]);

  // Handle card click
  const handleCardClick = (id: number) => {
    // Don't allow clicking if checking, game won, or card already flipped/matched
    if (isChecking || gameWon) return;

    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    // Don't allow clicking if 2 cards are already flipped
    if (flippedCards.length >= 2) return;

    // Start game on first card click
    if (!gameStarted) {
      setGameStarted(true);
      setElapsedTime(0);
    }

    // Flip the card
    setCards((prevCards) =>
      prevCards.map((c) => (c.id === id ? { ...c, flipped: true } : c))
    );
    setFlippedCards((prev) => [...prev, id]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Debug: log card count
  useEffect(() => {
    console.log("Cards rendered:", cards.length);
  }, [cards]);

  return (
    <div className="memory-match-game" data-grid-size={gridSize}>
      <div className="memory-match-header">
        <div className="memory-match-stats">
          <div className="memory-match-stat">
            <span className="stat-label">Moves</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="memory-match-stat">
            <span className="stat-label">Time</span>
            <span className="stat-value">{formatTime(elapsedTime)}</span>
          </div>
        </div>
        <button
          className="cta primary"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("New Game button clicked");
            // Navigate to memory match page if not already there
            if (!gameMode) {
              navigate("/games/memory-match");
            } else {
              initializeGame();
            }
          }}
          type="button"
        >
          New Game
        </button>
      </div>

      {gameWon && (
        <div className="memory-match-win">
          <h3>🎉 You Won!</h3>
          <p>
            Completed in {moves} {moves === 1 ? "move" : "moves"} in{" "}
            {formatTime(elapsedTime)}
          </p>
          {progressMessage && (
            <p className="progress-message">{progressMessage}</p>
          )}
          <div className="best-scores">
            {(() => {
              const bestMoves = getBestMoves(gridSize);
              const bestTime = getBestTime(gridSize);
              return (
                <>
                  {bestMoves !== null && (
                    <p className="best-score">
                      Best moves: <strong>{bestMoves}</strong>
                    </p>
                  )}
                  {bestTime !== null && (
                    <p className="best-score">
                      Best time: <strong>{formatTime(bestTime)}</strong>
                    </p>
                  )}
                </>
              );
            })()}
          </div>
          <button
            className="cta primary"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              initializeGame();
            }}
            type="button"
          >
            Play Again
          </button>
        </div>
      )}

      {cards.length === 0 ? (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          Loading game...
        </div>
      ) : (
        <div
          className="memory-match-grid"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZES[gridSize].cols}, 1fr)`,
          }}
        >
          {cards.map((card) => (
            <button
              key={`card-${card.id}`}
              type="button"
              className={`memory-match-card ${card.flipped ? "flipped" : ""} ${
                card.matched ? "matched" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Card clicked:", card.id);
                handleCardClick(card.id);
              }}
              disabled={
                isChecking ||
                gameWon ||
                card.matched ||
                (flippedCards.length >= 2 && !card.flipped)
              }
              style={{
                opacity:
                  isChecking && flippedCards.includes(card.id)
                    ? 1
                    : flippedCards.length >= 2 && !card.flipped && !card.matched
                    ? 0.6
                    : 1,
              }}
              aria-label={`Card ${
                card.flipped || card.matched
                  ? cardType === "icons"
                    ? `icon ${card.value}`
                    : card.value
                  : "hidden"
              }`}
            >
              <div className="card-front">?</div>
              <div className="card-back">
                {cardType === "icons"
                  ? (() => {
                      const IconComponent = getIcon(card.value);
                      const iconColor = getColor(card.value);
                      // Adjust icon size based on grid size
                      const iconSize =
                        gridSize === "4x4" ? 48 : gridSize === "8x8" ? 32 : 24;
                      return (
                        <IconComponent
                          size={iconSize}
                          strokeWidth={2}
                          color={iconColor}
                        />
                      );
                    })()
                  : card.value}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
