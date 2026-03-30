// This file intentionally re-exports the user-specified shared skill implementation.
//
// CRA (react-scripts) restricts imports to within `src/`. By keeping a thin module
// inside `src/` that points to the canonical skill location, we preserve the
// user requirement (skill lives under `/home/kavia/workspace/code-generation/skills`)
// while keeping the app buildable.
//
// eslint-disable-next-line import/no-unresolved
export { default } from "../../../../../skills/ticTacToe/TicTacToeSkill";
