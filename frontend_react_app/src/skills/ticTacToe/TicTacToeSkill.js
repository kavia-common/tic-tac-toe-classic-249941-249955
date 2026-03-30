import React, { useMemo, useState } from "react";

const LINES = [
  // rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // cols
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // diagonals
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(squares) {
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

function isBoardFull(squares) {
  return squares.every((s) => s !== null);
}

// PUBLIC_INTERFACE
export default function TicTacToeSkill() {
  /** Minimal Tic-Tac-Toe skill/module: local two-player game with win/draw detection and reset. */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);
  const isDraw = !winner && isBoardFull(squares);

  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return "Draw";
    return `Next player: ${xIsNext ? "X" : "O"}`;
  }, [winner, isDraw, xIsNext]);

  function handleSquareClick(index) {
    if (winner) return;
    if (squares[index]) return;

    setSquares((prev) => {
      const next = prev.slice();
      next[index] = xIsNext ? "X" : "O";
      return next;
    });
    setXIsNext((prev) => !prev);
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <main className="tttPage">
      <section className="tttCard" aria-label="Tic Tac Toe">
        <header className="tttHeader">
          <div>
            <h1 className="tttTitle">Tic-Tac-Toe</h1>
            <p className="tttSubtitle">Two players • Local play</p>
          </div>

          <div className="tttStatus" role="status" aria-live="polite">
            {statusText}
          </div>
        </header>

        <div className="tttBoard" role="grid" aria-label="3 by 3 board">
          {squares.map((value, idx) => {
            const isHighlighted = line ? line.includes(idx) : false;
            const label = value ? `Square ${idx + 1}, ${value}` : `Square ${idx + 1}, empty`;
            return (
              <button
                key={idx}
                type="button"
                className={`tttSquare ${isHighlighted ? "tttSquare--win" : ""}`}
                onClick={() => handleSquareClick(idx)}
                role="gridcell"
                aria-label={label}
                disabled={Boolean(winner) || Boolean(value)}
              >
                <span className={`tttMark ${value ? "tttMark--set" : ""}`}>{value || ""}</span>
              </button>
            );
          })}
        </div>

        <footer className="tttFooter">
          <button type="button" className="tttButton" onClick={resetGame}>
            New game
          </button>
          <div className="tttHint">
            {winner || isDraw ? "Play again?" : "Click a square to place your mark."}
          </div>
        </footer>
      </section>
    </main>
  );
}
