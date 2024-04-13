import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";
import { dealRiverCards, dealPlayerCards } from "./cardUtils";
import { handleStartBettingRound } from "./handleStartBettingRound";

export const handleStartRound = (game: Game) => {
  // Find the game with the given ID
  // Assign the first player as little blind and second player as big blind
  let players = game.players;

  game.potSize = 0;
  game.curBettingRound = 0;

  // Remove all fold/allin flags
  players.forEach((player) => {
    player.foldFG = false;
    player.allInFg = false;
    player.isBigBlind = false;
    player.isLittleBlind = false;
    player.splitPotVal = 0;
  });

  // Assign Blind Bets

  // Here we need to find the next player who hasn't been eliminated, make them the little blind, if this instance isnt the first round

  if (game.roundCount !== 0) {
    let currLittleBlind = game.curLittleBlind + 1;
    if (currLittleBlind === 5) currLittleBlind = 1;
    // if the the next little blind is eliminated, find the next player who hasn't been eliminated
    while (game.players[currLittleBlind - 1].eliminated) {
      currLittleBlind = (currLittleBlind + 1) % (game.playerCount + 1);
      if (currLittleBlind === 0) currLittleBlind = 1;
    }
    game.curLittleBlind = currLittleBlind;
  }

  players[game.curLittleBlind - 1].money -= game.littleBlindBet;
  players[game.curLittleBlind - 1].isLittleBlind = true;
  players[game.curLittleBlind - 1].lastBet = game.littleBlindBet;

  game.potSize += players[game.curLittleBlind - 1].lastBet;

  if (game.roundCount !== 0) {
    let curBigInd = game.curLittleBlind + 1;
    if (curBigInd === 5) curBigInd = 1;
    while (game.players[curBigInd - 1].eliminated) {
      curBigInd = (curBigInd + 1) % (game.playerCount + 1);
      if (curBigInd === 0) curBigInd = 1;
    }
    game.curBigBlind = curBigInd;
  }

  players[game.curBigBlind - 1].money -= game.bigBlindBet;
  players[game.curBigBlind - 1].isBigBlind = true;
  players[game.curBigBlind - 1].lastBet = game.bigBlindBet;

  game.potSize += players[game.curBigBlind - 1].lastBet;

  // make the player after the big blind the current player
  let curPlayerInd = game.curBigBlind + 1;
  while (game.players[curPlayerInd - 1].eliminated) {
    curPlayerInd = (curPlayerInd + 1) % (game.playerCount + 1);
    if (curPlayerInd === 0) curPlayerInd = 1;
  }

  game.currentPlayer = curPlayerInd; // Set new player index
  players[game.currentPlayer - 1].currentTurn = true;

  game.currentBet = game.bigBlindBet;

  // call function to 'give' players their cards here
  dealPlayerCards(game);

  game.currentBet = game.bigBlindBet;

  // Start betting round
  return handleStartBettingRound(game);
};
