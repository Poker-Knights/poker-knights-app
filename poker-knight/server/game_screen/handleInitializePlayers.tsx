import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";
import { dealPlayerCards, dealRiverCards } from "./cardUtils";
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

    // make the first player the one with the current turn
    players[0].currentTurn = true;

    game.players = players;
    game.currentPlayer = 1;

    // this will be reworked with matts implementation
    dealRiverCards(game, 1);
    console.log(game.riverCards);
    dealRiverCards(game, 2);
    dealPlayerCards(game);
    Socket.emit("updateRiverCards", game.riverCards);
    Socket.emit("updatePlayerCards", game.players);

    console.log(game.players);

    return;
  };
