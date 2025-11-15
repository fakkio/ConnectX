import {PlayerConfiguration} from "@/app/PlayerConfiguration";
import {Button} from "@/components/ui/button";
import {TypographyH1, TypographyLead} from "@/components/ui/typography";
import {PlayerConfig, useGame} from "@/context/GameContext";
import {useForm} from "react-hook-form";
import styles from "./Intro.module.css";

export interface FormValues {
  players: PlayerConfig[];
}
const defaultValues: FormValues = {
  players: [
    {
      type: "human",
      name: "Player 1",
      color: "#ff010b",
    },
    {
      type: "monte-carlo",
      name: "Player 2",
      color: "#ffd918",
    },
  ],
};

export function Intro() {
  const {start} = useGame();

  const {control, handleSubmit} = useForm({defaultValues});
  const formMethods = {control};

  const startGame = (values: FormValues) => {
    start(values.players);
  };

  return (
    <div className={styles.introWrapper}>
      <div>
        <TypographyH1>Connect 4</TypographyH1>
        <TypographyLead>
          Configure your players and let the game begin!
        </TypographyLead>
      </div>
      <form
        id="player-configuration-form"
        className={styles.form}
        onSubmit={handleSubmit(startGame)}
      >
        <PlayerConfiguration
          name="players.0"
          label="Player 1"
          {...formMethods}
        />
        <PlayerConfiguration
          name="players.1"
          label="Player 2"
          {...formMethods}
        />
      </form>
      <Button type="submit" form="player-configuration-form">
        Start game
      </Button>
    </div>
  );
}
