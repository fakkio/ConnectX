import type {Board} from "./Board";

export interface Player {
  name: string;
  color: string;
  move: (board: Board) => Promise<number>;
}

export interface Move {
  col: number;
  player: Player;
}

export type MovesHistory = Move[];

export class Connect4Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Connect4Error";
  }
}

export type GameState =
  | {status: "play"}
  | {status: "win"; winner: Player; discsCoordinates: [number, number][]}
  | {status: "draw"};
