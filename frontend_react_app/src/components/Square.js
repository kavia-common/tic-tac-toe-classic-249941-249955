import React from "react";

/**
 * PUBLIC_INTERFACE
 * A single Tic-Tac-Toe square.
 *
 * @param {object} props
 * @param {number} props.index - Square index (0..8), row-major.
 * @param {null | "X" | "O"} props.value - Current square value.
 * @param {() => void} props.onClick - Click handler.
 * @param {boolean} [props.isWinning=false] - Whether this square is part of the winning line.
 * @param {boolean} [props.isDisabled=false] - Whether moves are currently disabled.
 * @returns {JSX.Element}
 */
export default function Square({
  index,
  value,
  onClick,
  isWinning = false,
  isDisabled = false,
}) {
  const className = ["ttt-square", isWinning ? "is-winning" : ""]
    .filter(Boolean)
    .join(" ");

  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={isDisabled || Boolean(value)}
      role="gridcell"
      aria-label={
        value
          ? `Row ${row}, column ${col}: ${value}`
          : `Row ${row}, column ${col}: empty`
      }
    >
      {value}
    </button>
  );
}
