import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";
import { removePlayer, handleExit } from "../../src/utils/Game";

export const handleExitGame =
  (socket: Socket, games: { [key: string]: Game }, socketID: any, gameID: string) => {
    console.log(`Removing ${socketID} from game with ID: ${gameID}`);
    
    const game = games[gameID];

    removePlayer(socketID, game);

    console.log(`${socketID} was removed from game with ID: ${gameID}`);

    socket.emit("gameExited");
  };
