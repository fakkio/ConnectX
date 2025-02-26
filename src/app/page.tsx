import {Game} from "@/engine/Game";

export default function Home() {
  const game = new Game();
  game.insert(3);
  game.insert(3);
  game.insert(4);
  game.insert(2);
  game.insert(5);
  game.insert(2);
  game.insert(6);
  console.log(game.board);
  console.log("" + game.board);

  return (
    <div>
      <h1>Connect 4</h1>
      <pre>{JSON.stringify(game, null, 2)}</pre>
    </div>
  );
}
