import React from "react";
import TicTacToeSkill from "./skills_external/ticTacToe/TicTacToeSkill";

// PUBLIC_INTERFACE
function App() {
  /** Root component that renders the Tic-Tac-Toe skill/module. */
  return (
    <div className="appShell">
      <TicTacToeSkill />
    </div>
  );
}

export default App;
