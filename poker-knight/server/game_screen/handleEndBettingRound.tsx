import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";

export const handleStartBettingRound =
  (Socket: Socket, games: { [key: string]: Game }) => (inputGameID: string) => {
    // Find the game with the given ID
    const game = games[inputGameID];

    // Increment Betting Round
    game.curBettingRound++;

    // Save current pots
    game.players.forEach((player) => {
      player.splitPotVal = game.potSize;
    });

    // emit the updated game
    Socket.emit("startBettingRound", game);

    return;
  };
