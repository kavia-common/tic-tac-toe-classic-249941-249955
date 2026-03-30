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
  const resetBoard = (nextXStarts) => {
    /**
     * Reset game deterministically.
     * - Always uses a fresh board array (no shared references).
     * - Sets who starts next explicitly.
     */
    setSquares(Array(9).fill(null));
    setXIsNext(Boolean(nextXStarts));
  };

  // PUBLIC_INTERFACE
  const handleSquareClick = (index) => {
    /**
     * Deterministic move handling:
     * - Derive everything (locked state, whose turn, validity) from the latest state in functional updaters.
     * - Toggle turn ONLY when we actually place a mark.
     * This avoids stale closures/batched state updates causing incorrect turn switching.
     */
    setSquares((prevSquares) => {
      const winnerNow = calculateWinner(prevSquares);
      const isDrawNow = !winnerNow && prevSquares.every((sq) => sq !== null);
      const isLockedNow = Boolean(winnerNow) || isDrawNow;
      if (isLockedNow) return prevSquares;

      if (prevSquares[index] !== null) return prevSquares;

      const nextSquares = [...prevSquares];
      nextSquares[index] = xIsNext ? "X" : "O";

      // Toggle turn in the same user action, but only when the move is valid.
      setXIsNext((prev) => !prev);
      return nextSquares;
    });
  };

  // PUBLIC_INTERFACE
  const handleNewGame = () => resetBoard(true);

  // PUBLIC_INTERFACE
  const handleReset = () => resetBoard(xIsNext);

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
              <button
                type="button"
                className="btn"
                onClick={handleReset}
                aria-label="Reset the board (keep the current starting player)"
              >
                Reset
              </button>
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

            <p className="hint">
              Tip: <strong>Reset</strong> clears the board but keeps the current starter.{" "}
              <strong>New game</strong> always starts with X.
            </p>
          </footer>
        </section>
      </main>
    </div>
  );
}
