import {BoardState} from "@/engine/Board";
import type {HumanPlayer} from "./HumanPlayer";

export interface Player {
  type: "human" | "computer";
  name: string;
  color: string;
  move: () => Promise<number>;
}

export function isHumanPlayer(player: Player | null): player is HumanPlayer {
  return player?.type === "human";
}

export interface Move {
  col: number;
  player: Player;
}

export type MovesHistory = Move[];

export interface GameStateReady {
  status: "ready";
}
export interface GameStatePlay {
  status: "play";
  board: BoardState;
  history: MovesHistory;
  currentPlayer: Player;
}
export interface GameStateWin {
  status: "win";
  board: BoardState;
  history: MovesHistory;
  currentPlayer: Player | null;
  winner: Player;
  discsCoordinates: [row: number, col: number][];
}
export interface GameStateDraw {
  status: "draw";
  board: BoardState;
  history: MovesHistory;
  currentPlayer: Player | null;
}

export type GameState =
  | GameStateReady
  | GameStatePlay
  | GameStateWin
  | GameStateDraw;

// Base interface for player configs — players should define their own specific config types in their modules
export interface PlayerConfigBase {
  type: string;
  name: string;
  color: string;
}

export class Connect4Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Connect4Error";
  }
}
