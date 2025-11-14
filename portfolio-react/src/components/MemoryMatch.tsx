import { useState, useEffect, useRef } from "react";

type Card = {
  id: number;
  value: number;
  flipped: boolean;
  matched: boolean;
};

const CARD_PAIRS = [1, 2, 3, 4, 5, 6, 7, 8];

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const createNewGame = (): Card[] => {
  // Create pairs of cards
  const cardValues = [...CARD_PAIRS, ...CARD_PAIRS];
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

export default function MemoryMatch() {
  const [cards, setCards] = useState<Card[]>(() => createNewGame());
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
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
    const newCards = createNewGame();

    // Reset all state
    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setGameWon(false);
    setIsChecking(false);
    setGameStarted(false);
    setElapsedTime(0);

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

  // Check for win condition
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.matched) && !gameWon) {
      setGameWon(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = undefined;
      }
    }
  }, [cards, gameWon]);

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
    <div className="memory-match-game">
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
            initializeGame();
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
        <div className="memory-match-grid">
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
                card.flipped || card.matched ? card.value : "hidden"
              }`}
            >
              <div className="card-front">?</div>
              <div className="card-back">{card.value}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
