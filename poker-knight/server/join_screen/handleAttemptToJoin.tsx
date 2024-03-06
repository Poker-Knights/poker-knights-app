import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";
import { createAndAddPlayer } from "../../src/utils/Game";

export const handleAttemptToJoin =
  (socket: Socket, games: { [key: string]: Game }) =>
  (inputGameID: string, username: string) => {
    const game = games[inputGameID];

    if (!game) {
      socket.emit("gameNotFound", { gameID: inputGameID });
      return;
    }

    if (game.players.some((player) => player.name === username)) {
      socket.emit("usernameTaken", { gameID: inputGameID });
      return;
    }

    if (game.playerCount < 4) {
      // Use utility function to create and add a new player
      createAndAddPlayer(username, socket.id, game);

      socket.emit("gameJoined", { gameState: game });
    } else {
      socket.emit("gameNotFound", { gameID: inputGameID });
    }
  };
