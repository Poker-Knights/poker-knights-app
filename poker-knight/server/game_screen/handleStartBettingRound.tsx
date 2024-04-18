import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";
import { dealRiverCards } from "./cardUtils";
import { nextPlayer } from "./handleButtonPress";

export const handleStartBettingRound = (game: Game) => {
  // Assign the first player as little blind and second player as big blind
  let players = game.players;
  game.checkCounter = 0;
  // Assign Game Updates
  if (game.curBettingRound !== 0) {
    game.currentBet = 0;
    // every players current bet is 0
    players.forEach((player) => {
      // if the player is eliminated, skip them
      if (player.foldFG) return;
      player.lastBet = 0;
      player.lastTurnCheckFG = false;
    });
  } else {
    // this is the first betting round
    players.forEach((player) => {
      if (!player.isLittleBlind && !player.isBigBlind) {
        // if the player is eliminated, skip them
        if (player.eliminated) return;
        player.lastBet = 0;
      }
    });
  }

  // set players equal to game players
  game.players = players;

  // call function to deal cards here
  switch (game.curBettingRound) {
    case 0:
      // No cards dealt
      break;
    case 1:
      // Deal 3 cards
      game = dealRiverCards(game, 1);

      break;
    case 2:
      game = dealRiverCards(game, 2);

      break;
    case 3:
      game = dealRiverCards(game, 2);
      break;

    default:
      // nothing
      break;
  }

  return game;
};
