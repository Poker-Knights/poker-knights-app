import { Server, Socket } from 'socket.io';
import express from 'express';
import http from 'http';
// Adjust the import path according to your project structure
import { Game, Player } from '../src/types/Game';
import { handleCreateGame } from './home_screen/handleCreateGame'; 
import { handleAttemptToJoin } from './join_screen/handleAttemptToJoin';
import { handleEndRound } from "./game_screen/handleEndRound";
import { handleExitGame } from './game_screen/handleExitGame'; 
import { handleInitializePlayersforGame } from './game_screen/handleInitializePlayers';




const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*", // Allows all origins for development purposes only!
      methods: ["GET", "POST"],
    },
  });
const PORT = 3000;

const games: { [key: string]: Game } = {};

io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Register event handlers for this connection
    socket.on('createGame', handleCreateGame(socket, games)); 
    socket.on('attemptToJoin', handleAttemptToJoin(socket, games));
    // socket.on('exitGame', console.log("we made it here"));
    
    socket.on("exitGame", (socketID, gameID) => {
      handleExitGame(socket, games, socketID, gameID);
    });


    // Listen for Intiialize game event for a game
    socket.on('initializePlayers', handleInitializePlayersforGame(socket, games));

    // Listen for player pressing button, the emitted client is sending the game and the game id
    socket.on('updateGameAfterPlayerButtonPress', (game: Game, gameId: string) => {
        // Update the game with the new game state
        games[gameId] = game;
        
        // Check if betting round ended
        let roundEndedFG: number = 1;
        game.players.forEach((player) => {
          if(player.lastBet === -1){
            roundEndedFG = 0; /// Round not over
          }
        });
        // If the round ended
        if(roundEndedFG){
          //handleEndRound(socket, games, gameId);
        }

            // check if 5 cards on river
                // enter showdown <--- lots of logic will need to be added here
                  // handle Showdown logic
            // else add card to river and reset current bet and possibly current player and emit game updated

        // Otherwise move to next player
        io.to(gameId).emit('gameUpdatedAfterPlayerTurn', game);
    });


    
    // Example of disconnect event
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});