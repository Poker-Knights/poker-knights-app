import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";

export const handleEndRound =
  (Socket: Socket, games: { [key: string]: Game }) => (inputGameID: string) => {
    // Find the game with the given ID
    const game = games[inputGameID];

    // Perform Hand Analysis

    // Perform Chip adjustments
    // Round winner chips += potSize

    // Undeal/remove Cards

    // emit the updated game
    Socket.emit("roundEnded", game);

    return;
  };
