import { Server, Socket } from "socket.io";
import express from "express";
import http from "http";
import cors from "cors";
// Adjust the import path according to your project structure
import { Game, Player } from "../src/types/Game";
import { handleCreateGame } from "./home_screen/handleCreateGame";
import { handleAttemptToJoin } from "./join_screen/handleAttemptToJoin";
import { handleEndRound } from "./game_screen/handleEndRound";
import { handleExitGame } from "./game_screen/handleExitGame";
import { handleStartGame } from "./game_screen/handleStartGame";
import { handleStartRound } from "./game_screen/handleStartRound";
import { PLAYER_COUNT } from "../src/utils/socket";
import { handleButtonPress } from "./game_screen/handleButtonPress";
import { handleEndBettingRound } from "./game_screen/handleEndBettingRound";
import { handleStartBettingRound } from "./game_screen/handleStartBettingRound";

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allows all origins for development purposes only!
    methods: ["GET", "POST"],
  },
});
const PORT = 3000;

const games: { [key: string]: Game } = {};

io.on("connection", (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);

  // Register event handlers for this connection
  socket.on("createGame", handleCreateGame(socket, games));
  socket.on("attemptToJoin", handleAttemptToJoin(socket, games));
  // socket.on('exitGame', console.log("we made it here"));

  socket.on("joinRoom", ({ gameId }) => {
    socket.join(gameId);
    console.log(games[gameId].players.length);

    // Broadcast the updated player list to all clients in the room if its less than the player count
    if (games[gameId].players.length <= PLAYER_COUNT) {
      io.to(gameId).emit("updatePlayers", games[gameId]);
    }
    // if enough players joined the game, have the game ready to start
    if (games[gameId].players.length === PLAYER_COUNT) {
      // Start the game, pass the game id to get the game you need to start
      let game = games[gameId];
      game = handleStartGame(game); // game configure to start
      games[gameId] = game;

      setTimeout(() => {
        io.to(gameId).emit("gameStarted", games[gameId]);
      }, 3000);
    }
  });

  socket.on("buttonPressed", ({ game, gameID, buttonPressed, betValue }) => {
    games[gameID] = handleButtonPress(games[gameID], buttonPressed, betValue);

    setTimeout(() => {
    io.to(gameID).emit("handleButtonPressed", games[gameID]);
    }, 250);
  });

    // Handle button pressed
    games[gameID] = handleButtonPress(games[gameID], buttonPressed, betValue);

    // Check if betting round ended
    // If all players have non zero for last bet
     // every players current bet is -1
     let players = games[gameID].players;
     let endBettingRoundFG = true;
     players.forEach((player) => {
      if(!player.foldFG && (player.lastBet === 0 || player.lastBet < games[gameID].currentBet)){
        endBettingRoundFG = false;
      }
    });

    // If the betting round is over
    if(endBettingRoundFG){
      games[gameID] = handleEndBettingRound(game);
      // If the round is over
      if(games[gameID].curBettingRound === 4){
        games[gameID] = handleEndRound(game);
        // Emit game results to client
        games[gameID] = handleStartRound(game);
      // else just start next betting round
      }else{
        games[gameID] = handleStartBettingRound(game);
      }
    }
    
  setTimeout(() => {
        io.to(gameID).emit("handledButtonPressed", games[gameID]);
      }, 3000);
  });

  // Example of disconnect event
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
