/**
 * Tic-Tac-Toe winner calculation utilities.
 */

/**
 * PUBLIC_INTERFACE
 * Determine if the current board has a winner.
 *
 * @param {(null | "X" | "O")[]} squares - Board squares in row-major order (length 9).
 * @returns {null | { winner: "X" | "O"; line: number[] }} Winner info (player + winning line indices), or null.
 */
export function calculateWinner(squares) {
  const lines = [
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

  for (const [a, b, c] of lines) {
    const value = squares[a];
    if (value && value === squares[b] && value === squares[c]) {
      return { winner: value, line: [a, b, c] };
    }
  }

  return null;
}
