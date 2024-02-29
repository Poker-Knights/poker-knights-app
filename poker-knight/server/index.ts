
// index.js in server/ directory
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
import { Socket } from 'socket.io-client';
import {Game, Player} from '../src/types/Game'

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

// Store the state of all games
const games: { [key: string]: Game } = {};


io.on('connection', (socket: Socket) => {
    console.log('a user connected: ${socket.id}');

    // Server side create game function
    socket.on('createGame', (data: { gameID: string; username: string; }) => { 
        // Grab game ID and host username from client side
        const gameID = data.gameID;
        const username = data.username;
        
        // Create the player parameters
        const newPlayer: Player = {
            id: socket.id,
            name: username,
            money: 500,
            avatarUri: '',
            currentTurn: false,
        }     
        // Create the game
        const games: { [key: string]: Game } = {};

        const newGame: Game = {
            id: gameID,
            players: [newPlayer],
            potSize: 0,
            playerCount: 1,
        };
        // Add the game to the games object
        games[gameID] = newGame;

        // send the initial gameState back to the client
        socket.emit('gameCreated', gameID);

    });

    // Various other events will need to be implemented here

    // Listen for incoming connections
    server.listen(PORT, () => {console.log('listening on *:3000')});

    

});