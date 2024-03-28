import { Server, Socket } from 'socket.io';
import express from 'express';
import http from 'http';
// Adjust the import path according to your project structure
import { Game, Player } from '../src/types/Game';
import { handleCreateGame } from './home_screen/handleCreateGame'; 
import { handleAttemptToJoin } from './join_screen/handleAttemptToJoin';
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

    // Handle joining a room
    socket.on('joinRoom', ({ gameId }) => {
      socket.join(gameId);
      
      // Broadcast the updated player list to all clients in the room
      io.to(gameId).emit('updatePlayers', games[gameId].players);
    });
    
    socket.on("exitGame", (socketID, gameID) => {
      handleExitGame(socket, games, socketID, gameID);
    });


    // Listen for Intiialize game event for a game
    socket.on('initializePlayers', handleInitializePlayersforGame(socket, games));

    // Example of disconnect event
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});