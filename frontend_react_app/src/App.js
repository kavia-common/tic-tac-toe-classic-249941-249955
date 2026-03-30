import React, { useMemo, useState } from "react";
import "./App.css";
import Board from "./components/Board";
import { calculateWinner } from "./utils/calculateWinner";

const EMPTY_BOARD = Array(9).fill(null);

/**
 * PUBLIC_INTERFACE
 * Main application component for the Tic-Tac-Toe game.
 *
 * Handles:
 * - Core game state (board + current player)
 * - Move handling (ignore invalid clicks)
 * - Win/draw detection
 * - Status messaging & winning-line highlighting
 *
 * @returns {JSX.Element}
 */
export default function App() {
  const [squares, setSquares] = useState(EMPTY_BOARD);
  const [xIsNext, setXIsNext] = useState(true);

  const winnerInfo = useMemo(() => calculateWinner(squares), [squares]);
  const winner = winnerInfo?.winner ?? null;
  const winningLine = winnerInfo?.line ?? [];

  const isDraw = useMemo(() => {
    // Draw only when board is full and there is no winner.
    return !winner && squares.every((sq) => sq !== null);
  }, [winner, squares]);

  const isBoardLocked = Boolean(winner) || isDraw;

  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return "Draw!";
    return `Next player: ${xIsNext ? "X" : "O"}`;
  }, [winner, isDraw, xIsNext]);

  // PUBLIC_INTERFACE
  const handleSquareClick = (index) => {
    // Apply move in a single state transition derived from the latest state.
    // This avoids any stale-closure issues if React batches updates.
    setSquares((prevSquares) => {
      const winnerNow = calculateWinner(prevSquares);
      const isDrawNow = !winnerNow && prevSquares.every((sq) => sq !== null);
      const isLockedNow = Boolean(winnerNow) || isDrawNow;

      // Ignore input after game ends.
      if (isLockedNow) return prevSquares;

      // Ignore invalid clicks on an occupied square.
      if (prevSquares[index] !== null) return prevSquares;

      const nextSquares = [...prevSquares];
      nextSquares[index] = xIsNext ? "X" : "O";
      return nextSquares;
    });

    // Switch turns only if the move is valid (i.e., the square was empty and game not locked).
    // We can infer validity from current visible state.
    if (!isBoardLocked && squares[index] === null) {
      setXIsNext((prev) => !prev);
    }
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
