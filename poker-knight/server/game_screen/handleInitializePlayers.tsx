import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";
import { handleStartRound } from "./handleStartRound";

export const handleInitializePlayersforGame =
  (Socket: Socket, games: { [key: string]: Game }) => (inputGameID: string) => {
    // Find the game with the given ID
    const game = games[inputGameID];
    game.gameStarted = true;

    // Assign the first player as little blind and second player as big blind
    let players = game.players;

    // give default starting amount of money
    players.forEach((player) => {
      player.money = 500;
    });

    // set players equal to game players
    game.players = players;

    // print player info for the current player
    console.log(
      "Current player: " +
        game.players[game.currentPlayer - 1].name +
        " with money: " +
        game.players[game.currentPlayer - 1].money +
        " and last bet: " +
        game.players[game.currentPlayer - 1].lastBet
    );

    handleStartRound(Socket, games);

    // emit the updated game
    Socket.emit("playersForGameInitialized", { gameState: game });

    return;
  };
