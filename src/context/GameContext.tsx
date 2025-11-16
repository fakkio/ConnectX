"use client";

import {ConnectX} from "@/engine/ConnectX";
import {HumanPlayer, HumanPlayerConfig} from "@/engine/HumanPlayer";
import {
  MonteCarloTreeSearchPlayerV1,
  MonteCarloPlayerConfig,
} from "@/engine/MonteCarloTreeSearchPlayerV1";
import {
  MonteCarloTreeSearchPlayerV2,
  MonteCarloUCTPlayerConfig,
} from "@/engine/MonteCarloTreeSearchPlayerV2";
import {RandomPlayer, RandomPlayerConfig} from "@/engine/RandomPlayer";
import {GameState, GameStateReady, Player} from "@/engine/types";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

// Recreate PlayerConfig union locally using imported player-specific configs
export type PlayerConfig =
  | HumanPlayerConfig
  | RandomPlayerConfig
  | MonteCarloPlayerConfig
  | MonteCarloUCTPlayerConfig;

type GameContextValue = {
  game: ConnectX;
  gameState: GameState;
  start: (players: PlayerConfig[]) => void;
};

const GameContext = createContext<GameContextValue | undefined>(undefined);
const game = new ConnectX();
const serverSnapshot = {status: "ready"} as GameStateReady;

const start = (playerConfigs: PlayerConfig[]) => {
  const players: Player[] = playerConfigs.map((cfg) => {
    if (cfg.type === "human") {
      return new HumanPlayer(game, cfg as HumanPlayerConfig);
    }
    if (cfg.type === "random") {
      return new RandomPlayer(game, cfg as RandomPlayerConfig);
    }
    if (cfg.type === "monte-carlo") {
      return new MonteCarloTreeSearchPlayerV1(
        game,
        cfg as MonteCarloPlayerConfig,
      );
    }
    if (cfg.type === "monte-carlo-uct") {
      return new MonteCarloTreeSearchPlayerV2(
        game,
        cfg as MonteCarloUCTPlayerConfig,
      );
    }

    throw new Error(`Unknown player config: ${JSON.stringify(cfg)}`);
  });
  void game.start(players);
};

export const GameProvider = ({children}: PropsWithChildren) => {
  const gameState = useSyncExternalStore(
    (callback) => game.subscribe(callback),
    () => game.gameState,
    () => serverSnapshot,
  );

  const value = useMemo(() => ({game, gameState, start}), [gameState]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export function useGame() {
  const value = useContext(GameContext);
  if (!value) throw new Error("useGame must be used within a GameProvider");
  return value;
}
