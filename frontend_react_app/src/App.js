import React, { useMemo, useState } from "react";
import "./App.css";
import Board from "./components/Board";
import { calculateWinner } from "./utils/calculateWinner";

const EMPTY_BOARD = Array(9).fill(null);

/**
 * PUBLIC_INTERFACE
 * Main application component for the Tic-Tac-Toe game.
 *
 * @returns {JSX.Element}
 */
export default function App() {
  const [squares, setSquares] = useState(EMPTY_BOARD);
  const [xIsNext, setXIsNext] = useState(true);

  const winnerInfo = useMemo(() => calculateWinner(squares), [squares]);
  const winner = winnerInfo?.winner ?? null;
  const winningLine = winnerInfo?.line ?? [];

  const isDraw = useMemo(
    () => !winner && squares.every((sq) => sq !== null),
    [winner, squares]
  );

  const statusText = winner
    ? `Winner: ${winner}`
    : isDraw
      ? "Draw!"
      : `Next player: ${xIsNext ? "X" : "O"}`;

  const isBoardLocked = Boolean(winner) || isDraw;

  // PUBLIC_INTERFACE
  const handleSquareClick = (index) => {
    if (isBoardLocked) return;
    if (squares[index]) return;

    setSquares((prev) => {
      const next = [...prev];
      next[index] = xIsNext ? "X" : "O";
      return next;
    });
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const handleNewGame = () => {
    setSquares(EMPTY_BOARD);
    setXIsNext(true);
  };

  return (
    <div className="app-shell">
      <main className="app-main">
        <header className="app-header">
          <h1 className="app-title">Tic-Tac-Toe</h1>
          <p className="app-subtitle">Classic 3×3. Two players. One winner.</p>
        </header>

        <section className="game-card" aria-label="Game area">
          <div className="game-top">
            <div className="game-status" aria-live="polite">
              {statusText}
            </div>

            <button type="button" className="btn" onClick={handleNewGame}>
              New game
            </button>
          </div>

          <Board
            squares={squares}
            onSquareClick={handleSquareClick}
            winningLine={winningLine}
            isDisabled={isBoardLocked}
          />

          <footer className="game-footer">
            <span className="hint">
              Tip: squares lock after they’re played. Start a new game to reset.
            </span>
          </footer>
        </section>
      </main>
    </div>
  );
}
