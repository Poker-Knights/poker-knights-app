import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";
import { PLAYER_COUNT } from "../../src/utils/socket.js";
import { handleStartRound } from "./handleStartRound";

export const handleStartGame =
  (game: Game) => {
    // Create Intial Game object
    let curGame = game;
    curGame.littleBlindBet = 5;
    curGame.bigBlindBet = 10;
    curGame.curLittleBlind = 1;
    curGame.curBigBlind = 2;
    curGame.currentPlayer = 3;
    curGame.playerCount = PLAYER_COUNT;
    curGame.gameStarted = true;
    curGame.roundCount = 0;

    // give default starting amount of money
    curGame.players.forEach((player) => {
      player.money = 500;
      player.eliminated = false;
    });

    curGame.players[0].isLittleBlind = true;
    curGame.players[1].isBigBlind = true;

    // Call the function handle start round
    curGame = handleStartRound(curGame);

    return curGame;
  };
