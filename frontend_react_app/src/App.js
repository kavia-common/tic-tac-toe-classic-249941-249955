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
 * - Reset/new game
 * - UI indicators for current player and result state
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

  const currentPlayer = xIsNext ? "X" : "O";

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

  const resultTone = winner ? "win" : isDraw ? "draw" : "neutral";

  return (
    <div className="app-shell">
      <main className="app-main">
        <header className="app-header">
          <p className="app-kicker" aria-hidden="true">
            ARCADE EDITION
          </p>
          <h1 className="app-title">Tic‑Tac‑Toe</h1>
          <p className="app-subtitle">
            Retro 3×3 showdown. Use mouse or keyboard (Tab + Enter/Space).
          </p>
        </header>

        <section className="game-card" aria-label="Game area">
          <div className="game-top">
            <div className="status-stack">
              <div className={`game-status tone-${resultTone}`} aria-live="polite">
                {statusText}
              </div>

              <div className="indicator-row" aria-label="Player indicators">
                <div
                  className={[
                    "player-indicator",
                    "player-x",
                    currentPlayer === "X" && !winner && !isDraw ? "is-active" : "",
                    winner === "X" ? "is-winner" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-label="Player X"
                >
                  <span className="indicator-label">X</span>
                  <span className="indicator-meta">
                    {winner === "X" ? "WIN" : currentPlayer === "X" && !winner && !isDraw ? "TURN" : "—"}
                  </span>
                </div>

                <div
                  className={[
                    "player-indicator",
                    "player-o",
                    currentPlayer === "O" && !winner && !isDraw ? "is-active" : "",
                    winner === "O" ? "is-winner" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-label="Player O"
                >
                  <span className="indicator-label">O</span>
                  <span className="indicator-meta">
                    {winner === "O" ? "WIN" : currentPlayer === "O" && !winner && !isDraw ? "TURN" : "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="controls" role="group" aria-label="Game controls">
              <button type="button" className="btn" onClick={handleNewGame} aria-label="Start a new game">
                New game
              </button>
            </div>
          </div>

          <div className="board-wrap">
            <Board
              squares={squares}
              onSquareClick={handleSquareClick}
              winningLine={winningLine}
              isDisabled={isBoardLocked}
            />
          </div>

          <footer className="game-footer" aria-label="Help and legend">
            <div className="legend" role="list" aria-label="Legend">
              <div className="legend-item" role="listitem">
                <span className="legend-swatch swatch-active" aria-hidden="true" /> Active turn
              </div>
              <div className="legend-item" role="listitem">
                <span className="legend-swatch swatch-win" aria-hidden="true" /> Winning line
              </div>
              <div className="legend-item" role="listitem">
                <span className="legend-swatch swatch-locked" aria-hidden="true" /> Locked square
              </div>
            </div>

            <p className="hint">Tip: squares lock after they’re played. Start a new game to reset.</p>
          </footer>
        </section>
      </main>
    </div>
  );
}
