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

export type GameState =
  | {status: "ready"}
  | {status: "play"; history: MovesHistory}
  | {
      status: "win";
      history: MovesHistory;
      winner: Player;
      discsCoordinates: [number, number][];
    }
  | {status: "draw"; history: MovesHistory};

export class Connect4Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Connect4Error";
  }
}
