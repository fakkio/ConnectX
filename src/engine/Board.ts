import chalk from "chalk";
import {produce} from "immer";
import {Connect4Error, Move, Player} from "./types";

export type BoardState = {
  cols: number;
  rows: number;
  grid: Player[][];
};

export class Board {
  readonly #numCols: number;
  readonly #numRows: number;
  #state: BoardState;

  get state(): Readonly<BoardState> {
    return this.#state;
  }
  private set state(updater: (draft: BoardState) => void) {
    this.#state = produce(this.#state, (draft) => {
      updater(draft);
    });
  }

  constructor(
    numCols: number,
    numRows: number,
    _initGrid?: BoardState["grid"],
  ) {
    this.#numRows = numRows;
    this.#numCols = numCols;

    const initGrid: Player[][] = _initGrid
      ? Array.from({length: this.#numCols}, (_, c) => {
          return _initGrid[c].slice();
        })
      : Array.from({length: this.#numCols}, () => []);

    this.#state = {cols: numCols, rows: numRows, grid: initGrid};
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
        fullGrid[r][c] = this.state.grid[c][r] ?? null;
      }
    }

    return fullGrid;
  }

  canInsert(col: number): boolean {
    if (col < 0 || col >= this.#numCols || col !== Math.floor(col)) {
      throw new Connect4Error(`Invalid column index ${col}`);
    }

    return this.state.grid[col].length < this.#numRows;
  }

  availableColumns(): number[] {
    const availableCols: number[] = [];
    for (let col = 0; col < this.#numCols; col++) {
      if (this.canInsert(col)) {
        availableCols.push(col);
      }
    }
    return availableCols;
  }

  insert(col: number, player: Player): Move {
    if (col < 0 || col >= this.#numCols || col !== Math.floor(col)) {
      throw new Connect4Error(`Invalid column index ${col}`);
    }

    if (this.state.grid[col].length >= this.#numRows) {
      throw new Connect4Error(`Column ${col} is full`);
    }

    this.state = (state) => {
      state.grid[col].push(player);
    };

    return {col, player};
  }

  remove(col: number) {
    if (col < 0 || col >= this.#numCols || col !== Math.floor(col)) {
      throw new Connect4Error(`Invalid column index ${col}`);
    }

    if (this.state.grid[col].length === 0) {
      throw new Connect4Error(`Column ${col} is empty`);
    }

    this.state = (state) => {
      state.grid[col].pop();
    };
  }

  checkWin(
    lastMove: Move,
  ): {winner: Player; discsCoordinates: [number, number][]} | null {
    const checkSeries = (
      delta: [number, number],
    ): [col: number, row: number][] | undefined => {
      const {col, player} = lastMove;
      const row = this.state.grid[col].length - 1;
      let series: [col: number, row: number][] = [];

      for (let i = -3; i <= series.length; i++) {
        const deltaX = delta[0] * i;
        const deltaY = delta[1] * i;

        if (this.state.grid?.[col + deltaX]?.[row + deltaY] === player) {
          series.push([col + deltaX, row + deltaY]);
        } else {
          series = [];
        }

        if (series.length === 4) {
          return series;
        }
      }
    };

    // top-left to bottom-right
    let win = checkSeries([1, -1]);
    if (win) {
      return {winner: lastMove.player, discsCoordinates: win};
    }
    // bottom-left to top-right
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
    return this.state.grid.every((column) => column.length === this.#numRows);
  }

  toConsole(colorMode: boolean = true, lastMove?: Move): string {
    const maxNameLength = Math.max(
      ...this.state.grid.flat().map((player) => player.name.length),
    );
    const discsCoordinates = lastMove
      ? this.checkWin(lastMove)?.discsCoordinates
      : null;

    const asciiGrid = Array.from({length: this.#numRows}, () =>
      Array(this.#numCols),
    );
    for (let c = 0; c < this.#numCols; c += 1) {
      for (let r = 0; r < this.#numRows; r += 1) {
        const colorFunc = (color: string) => {
          if (!colorMode) {
            return (text: string) => text;
          } else if (
            discsCoordinates?.some(([col, row]) => col === c && row === r)
          ) {
            return chalk.bgHex(color).black;
          } else {
            return chalk.hex(color);
          }
        };

        asciiGrid[this.#numRows - r - 1][c] = this.state.grid[c][r]
          ? colorFunc(this.state.grid[c][r].color)(
              this.state.grid[c][r].name.padEnd(maxNameLength, " "),
            )
          : ".".repeat(maxNameLength);
      }
    }
    return asciiGrid.map((row) => row.join(" ")).join("\n");
  }

  toString() {
    return this.toConsole(false);
  }
}
