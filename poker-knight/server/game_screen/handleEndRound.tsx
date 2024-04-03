import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";
import { handleInitializePlayersforGame } from "./handleInitializePlayers";

export const handleEndRound =
  (Socket: Socket, games: { [key: string]: Game }) => (inputGameID: string) => {
    // Find the game with the given ID
    const game = games[inputGameID];

    // Perform Hand Analysis

    // Perform Chip adjustments

    // Increment Blinds
    if (game.curLittleBlind === game.playerCount) {
      game.curLittleBlind = 1;
    } else {
      game.curLittleBlind++;
    }
    if (game.curBigBlind === game.playerCount) {
      game.curBigBlind = 1;
    } else {
      game.curBigBlind++;
    }

    // emit the updated game
    Socket.emit("roundEnded", game);

    return;
  };
