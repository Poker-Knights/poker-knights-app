import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";

export const handleStartBettingRound = (game: Game) => {
  // Assign the first player as little blind and second player as big blind
  let players = game.players;

  // Assign Game Updates
  game.currentBet = 0;

  // every players current bet is -1
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
      // Burn 1 card
      break;
    case 2:
      // Deal 1 Card
      // Burn 1 card
      break;
    case 3:
      // Deal 1 Card
      // Burn 1 card
      break;
    default:
      // nothing
      break;
  }

  return game;
};