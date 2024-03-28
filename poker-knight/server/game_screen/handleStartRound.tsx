import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";
import { handleInitializePlayersforGame } from "./handleInitializePlayers";

export const handleStartRound =
  (Socket: Socket, games: { [key: string]: Game }) => (inputGameID: string) => {
    // Find the game with the given ID
    const game = games[inputGameID];

    // Assign the first player as little blind and second player as big blind
    let players = game.players;

    // Init Game
    game.potSize = 0;
    game.curBettingRound = 0;

    // Remove all fold/allin flags
    players.forEach((player) => {
      player.foldFG = false;
      player.allInFg = false;
      player.isBigBlind = false;
      player.isLittleBlind = false;
    });

    // Assign Blind Bets
    let curLittleInd = game.curLittleBlind;
    while (game.players[curLittleInd - 1].foldFG) {
      curLittleInd = (curLittleInd + 1) % 5;
      if (curLittleInd === 0) curLittleInd = 1;
    }
    game.curLittleBlind = curLittleInd;
    players[game.curLittleBlind - 1].money -= game.littleBlindBet;

    let curBigInd = game.curLittleBlind + 1;
    while (game.players[curBigInd - 1].foldFG) {
      curBigInd = (curBigInd + 1) % 5;
      if (curBigInd === 0) curBigInd = 1;
    }
    game.curBigBlind = curBigInd;
    players[game.curBigBlind - 1].money -= game.bigBlindBet;

    // set players equal to game players
    game.players = players;

    // call function to 'give' players their cards here

    // emit the updated game
    Socket.emit("roundStarted", game);

    return;
  };
