import { useState, useEffect } from "react";

type Player = "X" | "O" | null;
type Board = Player[];

const TicTacToe = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<Player | "draw" | null>(null);
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [draws, setDraws] = useState(0);

  // Load scores from localStorage on mount
  useEffect(() => {
    const savedXWins = localStorage.getItem("tic-tac-toe-x-wins");
    const savedOWins = localStorage.getItem("tic-tac-toe-o-wins");
    const savedDraws = localStorage.getItem("tic-tac-toe-draws");

    if (savedXWins) setXWins(parseInt(savedXWins, 10));
    if (savedOWins) setOWins(parseInt(savedOWins, 10));
    if (savedDraws) setDraws(parseInt(savedDraws, 10));
  }, []);

  // Save scores to localStorage when they change
  useEffect(() => {
    localStorage.setItem("tic-tac-toe-x-wins", xWins.toString());
    localStorage.setItem("tic-tac-toe-o-wins", oWins.toString());
    localStorage.setItem("tic-tac-toe-draws", draws.toString());
  }, [xWins, oWins, draws]);

  const checkWinner = (boardState: Board): Player | "draw" | null => {
    const winPatterns = [
      [0, 1, 2], // top row
      [3, 4, 5], // middle row
      [6, 7, 8], // bottom row
      [0, 3, 6], // left column
      [1, 4, 7], // middle column
      [2, 5, 8], // right column
      [0, 4, 8], // diagonal top-left to bottom-right
      [2, 4, 6], // diagonal top-right to bottom-left
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        boardState[a] &&
        boardState[a] === boardState[b] &&
        boardState[a] === boardState[c]
      ) {
        return boardState[a];
      }
    }

    // Check for draw
    if (boardState.every((cell) => cell !== null)) {
      return "draw";
    }

    return null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner === "X") {
        setXWins((prev) => prev + 1);
      } else if (gameWinner === "O") {
        setOWins((prev) => prev + 1);
      } else if (gameWinner === "draw") {
        setDraws((prev) => prev + 1);
      }
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
  };

  const resetScores = () => {
    setXWins(0);
    setOWins(0);
    setDraws(0);
  };

  const getCellContent = (cell: Player) => {
    if (cell === "X") {
      return (
        <span className="tic-tac-toe-x" aria-label="X">
          ✕
        </span>
      );
    }
    if (cell === "O") {
      return (
        <span className="tic-tac-toe-o" aria-label="O">
          ○
        </span>
      );
    }
    return null;
  };

  return (
    <div className="tic-tac-toe-container">
      <div className="tic-tac-toe-header">
        <h2 className="tic-tac-toe-title">⭕ Tic Tac Toe</h2>
        <div className="tic-tac-toe-stats">
          <div className="tic-tac-toe-stat">
            <span className="stat-label">X Wins</span>
            <span className="stat-value">{xWins}</span>
          </div>
          <div className="tic-tac-toe-stat">
            <span className="stat-label">O Wins</span>
            <span className="stat-value">{oWins}</span>
          </div>
          <div className="tic-tac-toe-stat">
            <span className="stat-label">Draws</span>
            <span className="stat-value">{draws}</span>
          </div>
        </div>
      </div>

      {winner && (
        <div className="tic-tac-toe-winner">
          {winner === "draw" ? (
            <p>🤝 It&apos;s a draw!</p>
          ) : (
            <p>🎉 Player {winner} wins!</p>
          )}
        </div>
      )}

      {!winner && (
        <div className="tic-tac-toe-turn">
          <p>
            Current player: <strong>{currentPlayer}</strong>
          </p>
        </div>
      )}

      <div className="tic-tac-toe-board">
        {board.map((cell, index) => (
          <button
            key={index}
            className={`tic-tac-toe-cell ${cell ? "filled" : ""} ${
              winner ? "game-over" : ""
            }`}
            onClick={() => handleCellClick(index)}
            disabled={!!cell || !!winner}
            aria-label={`Cell ${index + 1}, ${cell || "empty"}`}
            type="button"
          >
            {getCellContent(cell)}
          </button>
        ))}
      </div>

      <div className="tic-tac-toe-actions">
        <button className="cta primary" onClick={resetGame} type="button">
          {winner ? "Play Again" : "Reset Game"}
        </button>
        <button className="cta secondary" onClick={resetScores} type="button">
          Reset Scores
        </button>
      </div>
    </div>
  );
};

export default TicTacToe;
