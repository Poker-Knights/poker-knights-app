import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";
import { removePlayer, handleExit } from "../../src/utils/Game";

export const handleEndGame = (
  socket: Socket,
  games: { [key: string]: Game },
  socketID: any,
  gameID: string
) => {
  // Remove all players
};
