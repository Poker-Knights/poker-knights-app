import { Socket } from "socket.io";
import { Server } from "socket.io";
import { Game } from "../../src/types/Game";
import { PLAYER_COUNT } from "../../src/utils/socket";
import { handleAllIn } from "./handleAllIn";

export const handleEndBettingRound = (
  io: Server,
  gameID: string,
  game: Game
) => {
  // Increment Betting Round
  game.curBettingRound++;

  // Save current pots
  game.players.forEach((curPlayer) => {
    // If the player is eliminated skip them
    if (curPlayer.eliminated) return;
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

  let allInCount = 0;
  let numOfFoldedPlayers = 0;
  game.players.forEach((player) => {
    if (player.allInFg) {
      allInCount++;
    }
    if (player.foldFG || player.eliminated) {
      numOfFoldedPlayers++;
    }
  });

  console.log("ALL IN COUNT: " + allInCount);
  console.log("NUM OF FOLDED PLAYERS: " + numOfFoldedPlayers);
  if (allInCount >= PLAYER_COUNT - numOfFoldedPlayers - 1) {
    game = handleAllIn(io, gameID, game);
  }

  return game;
};
