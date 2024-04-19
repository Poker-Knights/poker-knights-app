import { Server } from "socket.io";
import { Game, Player } from "../../src/types/Game";
import { dealRiverCards } from "./cardUtils";
import { handleEndBettingRound } from "./handleEndBettingRound";
import { handleEndRound } from "./handleEndRound";
import { handleStartRound } from "./handleStartRound";

export const handleAllIn = (io: Server, gameID: string, game: Game) => {
  // show remaining cards on the river
  game = dealRiverCards(game, 3);
  game = handleEndRound(io, gameID, game);
  game = handleStartRound(game);

  return game;
};

export const delay = (delayTime: number) => {
  let count = delayTime;
  while (count != 0) count--;
};
