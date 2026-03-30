import React from "react";
import Square from "./Square";

/**
 * PUBLIC_INTERFACE
 * Tic-Tac-Toe board (3x3).
 *
 * @param {object} props
 * @param {(null | "X" | "O")[]} props.squares - Board squares (length 9).
 * @param {(index: number) => void} props.onSquareClick - Called when a square is clicked.
 * @param {number[]} [props.winningLine=[]] - Indices of the winning line (if any).
 * @param {boolean} [props.isDisabled=false] - Disable all squares (e.g., after win/draw).
 * @returns {JSX.Element}
 */
export default function Board({
  squares,
  onSquareClick,
  winningLine = [],
  isDisabled = false,
}) {
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
      {squares.map((value, idx) => (
        <Square
          key={idx}
          index={idx}
          value={value}
          onClick={() => onSquareClick(idx)}
          isWinning={winningLine.includes(idx)}
          isDisabled={isDisabled}
        />
      ))}
    </div>
  );
}
