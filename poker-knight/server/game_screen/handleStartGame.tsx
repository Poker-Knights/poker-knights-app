import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";

export const handleStartGame =
  (Socket: Socket, games: { [key: string]: Game }) => (inputGameID: string) => {
    // Create Intial Game objet
    let curGame = games[inputGameID];
    curGame.littleBlindBet = 10;
    curGame.bigBlindBet = 20;
    curGame.curLittleBlind = 1;
    curGame.curBigBlind = 2;
    curGame.currentPlayer = 3;
    curGame.playerCount = 4;
    curGame.gameStarted = true;

    // give default starting amount of money
    curGame.players.forEach((player) => {
      player.money = 500;
    });

    Socket.emit("gameStarted", curGame);

    return;
  };
