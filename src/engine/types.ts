export interface Player {
  type: "human" | "computer";
  name: string;
  color: string;
  move: () => Promise<number>;
}

export interface Move {
  col: number;
  player: Player;
}

export type MovesHistory = Move[];
export type BoardState = {
  cols: number;
  rows: number;
  grid: Player[][];
};

export interface GameState {
  status: "ready" | "play" | "win" | "draw";
  board: BoardState;
  history: {col: number; player: Player | null}[];
  currentPlayer: Player | null;
  winner?: Player;
  discsCoordinates?: [row: number, col: number][];
}

export class Connect4Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Connect4Error";
  }
}
