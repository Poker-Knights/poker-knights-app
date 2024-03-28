import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";
import { handleInitializePlayersforGame } from "./handleInitializePlayers";

export const handleStartBettingRound =
  (Socket: Socket, games: { [key: string]: Game }) => (inputGameID: string) => {
    // Find the game with the given ID
    const game = games[inputGameID];

    // Increment Betting Round
    game.curBettingRound++;

    // emit the updated game
    Socket.emit("startRound", game);

    return;
  };
