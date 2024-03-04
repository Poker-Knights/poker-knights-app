import { Server, Socket } from 'socket.io';
import express from 'express';
import http from 'http';
// Adjust the import path according to your project structure
import { Game, Player } from '../src/types/Game';

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

    console.log(`a user connected: ${socket.id}`);

    socket.once('createGame', (gameID: string, username: string) => {
        console.log(`gameID: ${gameID}, username: ${username}`);
        const newPlayer: Player = {
            id: socket.id,
            name: username,
            money: 500,
            avatarUri: '',
            currentTurn: false,

        };

        const newGame: Game = {
            id: gameID,
            // Add the new player to the game as the 0th index
            players: [newPlayer],
            potSize: 0,
            playerCount: 1,
        };

        games[gameID] = newGame;
        
        socket.emit('gameCreated', {gameState: newGame }); 
        console.log(newGame.players[0].name);
        console.log('gameCreated event emitted');
    });

    socket.on('attemptToJoin', (inputGameID: number, username: string) => {
        const game = games[inputGameID];

        // Check if username exists
        if (game && game.players.some((player) => player.name === username)) {
            socket.emit('usernameTaken', { gameID: inputGameID });
            return;
        }

        if (game && game.playerCount < 4) {
            // Add player to the game
            const newPlayer: Player = {
                id: socket.id,
                name: username,
                money: 500,
                avatarUri: '',
                currentTurn: false,
            };
            
            game.players.push(newPlayer);
            game.playerCount++;

            socket.emit('gameJoined', { gameState: game });

        } else {
            socket.emit('gameNotFound', { gameID: inputGameID });
        }
    });


});

server.listen(PORT, () => {
    console.log(`Server running on hehe *:${PORT}`);
});
