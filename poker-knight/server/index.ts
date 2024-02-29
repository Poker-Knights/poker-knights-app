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

app.get('/', (req, res) => {
    res.send('Hello, World!\n');
  });

io.on('connection', (socket: Socket) => {

    console.log(`a user connected: ${socket.id}`);

    socket.on('createGame', (data: { gameID: string; username: string; }) => {
        const { gameID, username } = data;

        const newPlayer: Player = {
            id: socket.id,
            name: username,
            money: 500,
            avatarUri: '',
            currentTurn: false,
        };

        const newGame: Game = {
            id: gameID,
            players: [newPlayer],
            potSize: 0,
            playerCount: 1,
        };

        games[gameID] = newGame;

        socket.emit('gameCreated', { gameID, gameState: newGame });
    });
});

server.listen(PORT, () => {
    console.log(`Server running on hehe *:${PORT}`);
});
