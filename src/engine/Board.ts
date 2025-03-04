import {Connect4Error, Move, Player} from "./types";

export class Board {
  grid: Player[][] = [];
  readonly #numCols: number;
  readonly #numRows: number;
  readonly #players: Player[];

  constructor(numCols: number, numRows: number, players: Player[]) {
    this.#numRows = numRows;
    this.#numCols = numCols;
    this.#players = players;

    for (let c = 0; c < numCols; c += 1) {
      this.grid[c] = [];
    }
  }

  get numRows() {
    return this.#numRows;
  }

  /**
   * Return a complete 2D representation of the grid where each cell contains a Player or null
   */
  get fullGrid() {
    const fullGrid: (Player | undefined)[][] = Array.from(
      {length: this.#numRows},
      () => Array(this.#numCols).fill(null),
    );

    for (let c = 0; c < this.#numCols; c += 1) {
      for (let r = 0; r < this.#numRows; r += 1) {
        fullGrid[r][c] = this.grid[c][r] ?? null;
      }
    }

    return fullGrid;
  }

  insert(col: number, player: Player) {
    if (col < 0 || col >= this.#numCols || col !== Math.floor(col)) {
      throw new Connect4Error(`Invalid column index ${col}`);
    }

    if (this.grid[col].length >= this.#numRows) {
      throw new Connect4Error(`Column ${col} is full`);
    }

    this.grid[col].push(player);
  }

  checkWin(
    lastMove: Move,
  ): {winner: Player; discsCoordinates: [number, number][]} | null {
    const checkSeries = (
      delta: [number, number],
    ): [col: number, row: number][] | undefined => {
      const {col, player} = lastMove;
      const row = this.grid[col].length - 1;
      let series: [col: number, row: number][] = [];

      for (let i = -3; i <= series.length; i++) {
        const deltaX = delta[0] * i;
        const deltaY = delta[1] * i;

        if (this.grid?.[col + deltaX]?.[row + deltaY] === player) {
          series.push([col + deltaX, row + deltaY]);
        } else {
          series = [];
        }

        if (series.length === 4) {
          return series;
        }
      }
    };

    // top-left tot bottom-right
    let win = checkSeries([1, -1]);
    if (win) {
      return {winner: lastMove.player, discsCoordinates: win};
    }
    // bottom-left tot top-right
    win = checkSeries([1, 1]);
    if (win) {
      return {winner: lastMove.player, discsCoordinates: win};
    }
    // horizontal
    win = checkSeries([1, 0]);
    if (win) {
      return {winner: lastMove.player, discsCoordinates: win};
    }
    // vertical
    win = checkSeries([0, 1]);
    if (win) {
      return {winner: lastMove.player, discsCoordinates: win};
    }

    return null;
  }

  isBoardFull(): boolean {
    return this.grid.every((column) => column.length === this.#numRows);
  }

  toString() {
    const asciiGrid = Array.from({length: this.#numRows}, () =>
      Array(this.#numCols).fill("."),
    );
    for (let c = 0; c < this.#numCols; c += 1) {
      for (let r = 0; r < this.#numRows; r += 1) {
        asciiGrid[this.#numRows - r - 1][c] =
          this.grid[c][r] === this.#players[0]
            ? "1"
            : this.grid[c][r] === this.#players[1]
              ? "2"
              : ".";
      }
    }
    return asciiGrid.map((row) => row.join(" ")).join("\n");
  }
}
