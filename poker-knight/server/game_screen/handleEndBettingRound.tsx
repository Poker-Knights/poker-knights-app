import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";

export const handleEndBettingRound = (game: Game) => {
  // Increment Betting Round
  game.curBettingRound++;

  // Save current pots
  game.players.forEach((curPlayer) => {
    // If the player had to go all in
    if (curPlayer.allInFg) {
      let valToSub = 0; // Value to store the sum of the bets not matched by player splitting pot
      // Loop through each player, skip the current player and players folded
      game.players.forEach((player2) => {
        if (player2.name === curPlayer.name || player2.foldFG) return;
        // If the player were looking at has bet more then the current player, subtract the difference
        if (curPlayer.lastBet < player2.lastBet) {
          valToSub += player2.lastBet - curPlayer.lastBet;
        }
      });
      curPlayer.splitPotVal = game.potSize - valToSub; // Subtract out value not matched to achieve proper pot size
    } else if (!curPlayer.foldFG) {
      curPlayer.splitPotVal = game.potSize; // If not all in and in, split pot is total pot
    }
  });

  game.players.forEach((curPlayer) => {
    console.log("Player: " + curPlayer.name + curPlayer.splitPotVal);
  });
  // Reset card and remove cards from player hands

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
