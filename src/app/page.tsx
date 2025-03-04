import {Game} from "@/engine/Game";

export default function Home() {
  const game = new Game();

  game.start();

  return (
    <div>
      <h1>Connect 4</h1>
      <pre>{JSON.stringify(game.board.fullGrid)}</pre>
    </div>
  );
}
