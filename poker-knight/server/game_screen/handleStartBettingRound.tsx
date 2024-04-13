import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";
import { dealRiverCards } from "./cardUtils";
import { nextPlayer } from "./handleButtonPress";

export const handleStartBettingRound = (game: Game) => {
  // Assign the first player as little blind and second player as big blind
  let players = game.players;
  // Assign Game Updates
  if (game.curBettingRound !== 0) {
    game.currentBet = 0;
    game.checkCounter = 0;
    // every players current bet is 0
    players.forEach((player) => {
      player.lastBet = 0;
      player.currentTurn = false;
    });
  } else {
    players.forEach((player) => {
      if (!player.isLittleBlind && !player.isBigBlind) {
        player.lastBet = 0;
      }
      player.currentTurn = false;
    });
  }

  // make the player after the big blind the current player
  game.currentPlayer = game.curBigBlind;
  game = nextPlayer(game); // Set new player index

  // set players equal to game players
  game.players = players;

  // call function to deal cards here
  switch (game.curBettingRound) {
    case 0:
      // No cards dealt
      break;
    case 1:
      // Deal 3 cards
      dealRiverCards(game, 1);

      break;
    case 2:
      dealRiverCards(game, 2);

      break;
    case 3:
      dealRiverCards(game, 2);
      break;

    default:
      // nothing
      break;
  }

  return game;
};
