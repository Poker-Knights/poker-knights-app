import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";

export const handleEndBettingRound = (game: Game) => {
  // Increment Betting Round
  game.curBettingRound++;

  // Save current pots
  game.players.forEach((player) => {
    player.splitPotVal = game.potSize;
  });

  /*
  current pot: 500 = lastFullRound + joshCur + kevCur + mattCur + sriCur -> 500 - 80 - 80 - 56 - 70 = 214
          Josh (100)      Kevin (100)       Matthew (56)       Sri (70)
last bet:    80               80                56                70
splitpotFG:   0                0                 1                 1
  |
  |--->     currentpot - (foreach.players.lastbet > curplayer.lastbet)
          ex: Sri -> 500 - (80-70) - (80 -70) = 480
          ex: Matt -> 500 - (80-56) - (80-56) - (70-56) = 438
  */

  return game;
};
