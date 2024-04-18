import { Server } from "socket.io";
import { Game, Player } from "../../src/types/Game";
import { dealRiverCards } from "./cardUtils";
import { handleEndBettingRound } from "./handleEndBettingRound";
import { handleEndRound } from "./handleEndRound";
import { handleStartRound } from "./handleStartRound";

export const handleAllIn = (io: Server, gameID: string, game: Game) => {
  // End the game
  // call function to deal cards here
  
  // show remaining cards on the river
  game = dealRiverCards(game, 3);

  // switch (game.curBettingRound) {
  //   case 0:
  //   // No cards dealt
  //   case 1:
  //     // Deal 3 cards
  //     dealRiverCards(game, 1);
  //   case 2:
  //     dealRiverCards(game, 2);
  //   case 3:
  //     dealRiverCards(game, 2);
  //   default:
  //     // nothing
  //     break;
  // }

  // broadcast to clients before ending the round


  console.log("HANDLE ALL IN " + game.riverCards) 
  game = handleEndRound(io, gameID, game);
  game = handleStartRound(game);

  return game;
};

export const delay = (delayTime: number) => {
  let count = delayTime;
  while (count != 0) count--;
};
