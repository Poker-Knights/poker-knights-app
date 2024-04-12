import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";
import { dealRiverCards } from "./cardUtils";

export const handleStartBettingRound = (game: Game) => {
  console.log("Starting betting round: " + game.curBettingRound);

  // Assign the first player as little blind and second player as big blind
  let players = game.players;

  // Assign Game Updates
  if (game.curBettingRound !== 0) game.currentBet = 0;

  // every players current bet is 0
  players.forEach((player) => {
    player.lastBet = 0;
    player.currentTurn = false;
  });

  // make the player after the big blind the current player
  let curPlayerInd = game.curBigBlind + 1;
  while (game.players[curPlayerInd - 1].foldFG) {
    curPlayerInd = (curPlayerInd + 1) % (game.playerCount + 1);
    if (curPlayerInd === 0) curPlayerInd = 1;
  }
  game.currentPlayer = curPlayerInd; // Set new player index
  players[game.currentPlayer - 1].currentTurn = true;

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
