import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";
import { handleInitializePlayersforGame } from "./handleStartGame";

export const handleStartRound =
  (Socket: Socket, games: { [key: string]: Game }) => (inputGameID: string) => {
    // Find the game with the given ID
    const game = games[inputGameID];

    if ((game.gameStarted = true)) {
      // Assign the first player as little blind and second player as big blind
      let players = game.players;

      // Assign Blind Bets
      players[game.curLittleBlind - 1].money -= game.littleBlindBet;
      players[game.curBigBlind - 1].money -= game.bigBlindBet;

      // call function to 'give' players their cards here

      // make the player after the big blind the current player
      game.currentPlayer = game.curBigBlind + 1;
      players[game.currentPlayer - 1].currentTurn = true;

      // set players equal to game players
      game.players = players;

      // emit the updated game
      Socket.emit("startRound", game);
    } else {
      // Start the Game
      handleInitializePlayersforGame(Socket, games);
    }
    return;
  };
