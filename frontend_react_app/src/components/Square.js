import React from "react";

/**
 * PUBLIC_INTERFACE
 * A single Tic-Tac-Toe square.
 *
 * @param {object} props
 * @param {null | "X" | "O"} props.value - Current square value.
 * @param {() => void} props.onClick - Click handler.
 * @param {boolean} [props.isWinning=false] - Whether this square is part of the winning line.
 * @param {boolean} [props.isDisabled=false] - Whether moves are currently disabled.
 * @returns {JSX.Element}
 */
export default function Square({ value, onClick, isWinning = false, isDisabled = false }) {
  const className = ["ttt-square", isWinning ? "is-winning" : ""].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={isDisabled || Boolean(value)}
      aria-label={value ? `Square: ${value}` : "Empty square"}
    >
      {value}
    </button>
  );
}
