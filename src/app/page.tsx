import Game from "@/components/game/Game";
import { GameProvider } from "@/game/state";

export default function Home() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}
