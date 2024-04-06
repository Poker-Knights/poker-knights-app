import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";
import { handleCreateAndAddPlayer } from "../game_screen/handleCreateAndAddPlayer";
import { amntOfPlayers } from "../../src/components/pages/LoadingScreen";

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

    if (game.playerCount < amntOfPlayers) { // sync this with number of players we want to allow to loading screen
      // Use utility function to create and add a new player
      handleCreateAndAddPlayer(username, socket.id, game);

      // Join the player to the game room
      socket.join(inputGameID);

      socket.emit("gameJoined", { gameState: game });
    } else {
      socket.emit("gameNotFound", { gameID: inputGameID });
    }
  };
