import { Game, Player } from "../../src/types/Game";
import { dealRiverCards } from "./cardUtils";
import { handleEndBettingRound } from "./handleEndBettingRound";
import { handleEndRound } from "./handleEndRound";

export const handleAllIn = (game: Game) => {
  // End the game
  game = handleEndBettingRound(game);
  // call function to deal cards here
  switch (game.curBettingRound) {
    case 0:
    // No cards dealt
    case 1:
      // Deal 3 cards
      dealRiverCards(game, 1);
      delay(3000000000);
    case 2:
      dealRiverCards(game, 2);
      delay(3000000000);
    case 3:
      dealRiverCards(game, 2);
      delay(3000000000);
    default:
      // nothing
      break;
  }

  game = handleEndRound(game);

  return game;
};

export const delay = (delayTime: number) => {
  let count = delayTime;
  while (count != 0) count--;
};
