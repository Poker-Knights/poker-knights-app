import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";


import { handleStartRound } from "./handleStartRound";

export const handleInitializePlayersforGame =
  (Socket: Socket, games: { [key: string]: Game }) => (inputGameID: string) => {


    console.log("Server Side Initializing Players");
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
    

    //handleStartRound(Socket, games);
    
    console.log(game.players)
    // emit the updated game
    Socket.emit("playersForGameInitialized", { gameState: game });

    return;
  };