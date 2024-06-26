import { Server, Socket } from "socket.io";
import express from "express";
import http from "http";
import cors from "cors";
// Adjust the import path according to your project structure
import { Game, Player } from "../src/types/Game";
import { handleCreateGame } from "./home_screen/handleCreateGame";
import { handleAttemptToJoin } from "./join_screen/handleAttemptToJoin";
import { handleEndRound } from "./game_screen/handleEndRound";
import { handleStartGame } from "./game_screen/handleStartGame";
import { handleStartRound } from "./game_screen/handleStartRound";
import { PLAYER_COUNT } from "../src/utils/socket";
import { dispGame, handleButtonPress } from "./game_screen/handleButtonPress";
import { handleEndBettingRound } from "./game_screen/handleEndBettingRound";
import { handleStartBettingRound } from "./game_screen/handleStartBettingRound";
import { handleAllIn } from "./game_screen/handleAllIn";

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

  socket.on("joinRoom", ({ gameId }) => {
    socket.join(gameId);

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
    games[gameID] = handleButtonPress(game, buttonPressed, betValue);

    // Check if betting round ended
    let players = games[gameID].players;
    let endBettingRoundFG = true;
    let numOfFoldedPlayers = 0;

    players.forEach((player) => {
      if (
        !player.foldFG &&
        !player.eliminated &&
        !player.allInFg &&
        (player.lastBet === 0 || player.lastBet < games[gameID].currentBet)
      ) {
        endBettingRoundFG = false;
      }

      if (player.foldFG) {
        numOfFoldedPlayers++;
        if (player.lastTurnCheckFG) {
          games[gameID].checkCounter--;
          player.lastTurnCheckFG = false;
        }
      }
    });

    if (games[gameID].checkCounter === PLAYER_COUNT - numOfFoldedPlayers)
      endBettingRoundFG = true;

    // If the betting round is over
    if (endBettingRoundFG) {
      console.log("Handling End Betting Round");
      games[gameID] = handleEndBettingRound(io, gameID, games[gameID])!;

      // If the round is over
      if (games[gameID].curBettingRound === 4) {
        games[gameID] = handleEndRound(io, gameID, games[gameID]);

        // check if the game is over
        if (!games[gameID].gameWon) {
          games[gameID] = handleStartRound(games[gameID]);
        }
      }

      // Round not over, start new betting round
      else {
        if (!games[gameID].gameWon) {
          games[gameID] = handleStartBettingRound(games[gameID]);
        }
      }
    }

    setTimeout(() => {
      if (!games[gameID].gameWon) {
        io.to(gameID).emit("handledButtonPressed", games[gameID]);
      }
    }, 250);
  });

  // Exit logic here
  socket.on("exitGame", (gameID) => {
    setTimeout(() => {
      io.to(gameID).emit("navigateHome");
    }, 250);

    setTimeout(() => {
      delete games[gameID];
    }, 2000);
  });

  // Example of disconnect event
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    let gameID = "";
    for (const key in games) {
      if (games[key].players.some((player) => player.id === socket.id)) {
        gameID = key;
        break;
      }
    }

    io.to(gameID).emit("navigateHome");

    setTimeout(() => {
      delete games[gameID];
    }, 2000);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
