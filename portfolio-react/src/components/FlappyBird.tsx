import { useState, useEffect, useCallback, useRef } from "react";
import { useGameLoop } from "../hooks/useGameLoop";

interface Pipe {
  x: number;
  topHeight: number;
  bottomHeight: number;
  gap: number;
  passed: boolean;
}

interface Bird {
  x: number;
  y: number;
  velocity: number;
  rotation: number;
}

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const BIRD_SIZE = 30;
const BIRD_START_X = 80;
const BIRD_START_Y = GAME_HEIGHT / 2;
const GRAVITY = 0.5;
const JUMP_STRENGTH = -8;
const PIPE_WIDTH = 60;
const PIPE_GAP = 180; // Increased gap for easier gameplay
const PIPE_SPEED = 2;
const PIPE_SPACING = 200;
const GROUND_HEIGHT = 50;
const MIN_PIPE_HEIGHT = 80; // Minimum height for top and bottom pipes

const FlappyBird = () => {
  const [bird, setBird] = useState<Bird>({
    x: BIRD_START_X,
    y: BIRD_START_Y,
    velocity: 0,
    rotation: 0,
  });
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [pipeCounter, setPipeCounter] = useState(0);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("flappy-bird-high-score");
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  // Save high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("flappy-bird-high-score", score.toString());
    }
  }, [score, highScore]);

  // Initialize game
  const initializeGame = useCallback(() => {
    setBird({
      x: BIRD_START_X,
      y: BIRD_START_Y,
      velocity: 0,
      rotation: 0,
    });
    setPipes([]);
    setScore(0);
    setGameStarted(false);
    setGameOver(false);
    setPipeCounter(0);
  }, []);

  // Generate new pipe
  const generatePipe = useCallback((): Pipe => {
    // Calculate available space for pipes (excluding ground)
    const availableHeight = GAME_HEIGHT - GROUND_HEIGHT;

    // The gap size is ALWAYS exactly PIPE_GAP (180px)
    // We randomize the gap POSITION (vertical position) by changing topHeight
    // Formula: topHeight + PIPE_GAP + bottomHeight = availableHeight
    // This ensures the gap is always the same size, just at different positions

    // Calculate valid range for top pipe (this determines gap position)
    const minTopHeight = MIN_PIPE_HEIGHT;
    const maxTopHeight = availableHeight - PIPE_GAP - MIN_PIPE_HEIGHT;

    // Randomize the gap position by randomizing topHeight
    // This moves the gap up and down, but gap size stays constant
    const topHeight = Math.floor(
      Math.random() * (maxTopHeight - minTopHeight + 1) + minTopHeight
    );

    // Calculate bottom height to ensure gap is exactly PIPE_GAP
    // This formula guarantees the gap is always exactly PIPE_GAP pixels
    const bottomHeight = availableHeight - topHeight - PIPE_GAP;

    return {
      x: GAME_WIDTH,
      topHeight: topHeight,
      bottomHeight: Math.floor(bottomHeight),
      gap: PIPE_GAP, // Gap is always exactly PIPE_GAP (180px), position varies
      passed: false,
    };
  }, []);

  // Start game
  const startGame = useCallback(() => {
    if (gameOver) {
      initializeGame();
    }
    setGameStarted(true);
    setGameOver(false);
    setBird((prev) => ({ ...prev, velocity: JUMP_STRENGTH }));
    // Generate first pipe
    setPipes([generatePipe()]);
    setPipeCounter(0);
  }, [gameOver, initializeGame, generatePipe]);

  // Jump/flap
  const jump = useCallback(() => {
    if (!gameStarted || gameOver) {
      startGame();
      return;
    }
    setBird((prev) => ({ ...prev, velocity: JUMP_STRENGTH }));
  }, [gameStarted, gameOver, startGame]);

  // Check collision
  const checkCollision = useCallback(
    (birdY: number, birdX: number): boolean => {
      // Check ground and ceiling
      if (
        birdY + BIRD_SIZE / 2 >= GAME_HEIGHT - GROUND_HEIGHT ||
        birdY - BIRD_SIZE / 2 <= 0
      ) {
        return true;
      }

      // Check pipes
      for (const pipe of pipes) {
        if (
          birdX + BIRD_SIZE / 2 > pipe.x &&
          birdX - BIRD_SIZE / 2 < pipe.x + PIPE_WIDTH
        ) {
          if (
            birdY - BIRD_SIZE / 2 <= pipe.topHeight ||
            birdY + BIRD_SIZE / 2 >=
              GAME_HEIGHT - GROUND_HEIGHT - pipe.bottomHeight
          ) {
            return true;
          }
        }
      }

      return false;
    },
    [pipes]
  );

  // Game loop
  useGameLoop({
    callback: () => {
      if (!gameStarted || gameOver) return;

      setBird((prev) => {
        const newVelocity = prev.velocity + GRAVITY;
        const newY = Math.max(
          BIRD_SIZE / 2,
          Math.min(
            GAME_HEIGHT - GROUND_HEIGHT - BIRD_SIZE / 2,
            prev.y + newVelocity
          )
        );
        const newRotation = Math.min(90, Math.max(-30, newVelocity * 3));

        // Check collision
        if (checkCollision(newY, prev.x)) {
          setGameOver(true);
          setGameStarted(false);
        }

        return {
          ...prev,
          y: newY,
          velocity: newVelocity,
          rotation: newRotation,
        };
      });

      // Update pipes
      setPipes((prevPipes) => {
        const updatedPipes = prevPipes
          .map((pipe) => {
            const newX = pipe.x - PIPE_SPEED;
            let newPassed = pipe.passed;

            // Check if bird passed the pipe
            if (!pipe.passed && newX + PIPE_WIDTH < BIRD_START_X) {
              newPassed = true;
              setScore((prev) => prev + 1);
            }

            return {
              ...pipe,
              x: newX,
              passed: newPassed,
            };
          })
          .filter((pipe) => pipe.x + PIPE_WIDTH > 0);

        return updatedPipes;
      });

      // Generate new pipes
      setPipeCounter((prev) => {
        const newCounter = prev + PIPE_SPEED;
        if (newCounter >= PIPE_SPACING) {
          setPipes((prevPipes) => [...prevPipes, generatePipe()]);
          return 0;
        }
        return newCounter;
      });
    },
    delay: 16, // ~60 FPS
    enabled: gameStarted && !gameOver,
  });

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === " " ||
        event.key === "ArrowUp" ||
        event.key === "Enter"
      ) {
        event.preventDefault();
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jump]);

  // Mouse/touch input
  const handleClick = useCallback(() => {
    jump();
  }, [jump]);

  return (
    <div className="flappy-bird-container">
      <div className="flappy-bird-header">
        <h2 className="flappy-bird-title">🐦 Flappy Bird</h2>
        <div className="flappy-bird-stats">
          <div className="flappy-bird-stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="flappy-bird-stat">
            <span className="stat-label">Best</span>
            <span className="stat-value">{highScore}</span>
          </div>
        </div>
      </div>

      <div
        ref={gameContainerRef}
        className="flappy-bird-game"
        onClick={handleClick}
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Sky background */}
        <div className="flappy-bird-sky" />

        {/* Pipes */}
        {pipes.map((pipe, index) => (
          <div key={index}>
            {/* Top pipe */}
            <div
              className="flappy-bird-pipe flappy-bird-pipe-top"
              style={{
                left: `${pipe.x}px`,
                width: `${PIPE_WIDTH}px`,
                height: `${pipe.topHeight}px`,
              }}
            />
            {/* Bottom pipe */}
            <div
              className="flappy-bird-pipe flappy-bird-pipe-bottom"
              style={{
                left: `${pipe.x}px`,
                width: `${PIPE_WIDTH}px`,
                height: `${pipe.bottomHeight}px`,
                bottom: `${GROUND_HEIGHT}px`,
              }}
            />
          </div>
        ))}

        {/* Bird */}
        <div
          className="flappy-bird-bird"
          style={{
            left: `${bird.x}px`,
            top: `${bird.y}px`,
            transform: `translate(-50%, -50%) rotate(${bird.rotation}deg)`,
          }}
        >
          🐦
        </div>

        {/* Ground */}
        <div className="flappy-bird-ground" />

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="flappy-bird-overlay">
            <div className="flappy-bird-game-over">
              <h3>Game Over!</h3>
              <p>Score: {score}</p>
              {score === highScore && score > 0 && (
                <p className="flappy-bird-new-record">🎉 New High Score!</p>
              )}
              <button
                className="cta primary"
                onClick={(e) => {
                  e.stopPropagation();
                  startGame();
                }}
                type="button"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Start Screen */}
        {!gameStarted && !gameOver && (
          <div className="flappy-bird-overlay">
            <div className="flappy-bird-start-screen">
              <h3>🐦 Flappy Bird</h3>
              <p>Click or press Space/Enter to start</p>
              <p>Tap/Click to flap!</p>
            </div>
          </div>
        )}
      </div>

      <div className="flappy-bird-instructions">
        <p>Click or press Space/Enter/↑ to flap</p>
        <p>Avoid the pipes and don&apos;t hit the ground!</p>
      </div>
    </div>
  );
};

export default FlappyBird;
