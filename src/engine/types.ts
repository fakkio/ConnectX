import type {Board} from "./Board";

export interface Player {
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
