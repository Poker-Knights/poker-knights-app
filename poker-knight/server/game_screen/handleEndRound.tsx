import { Socket } from "socket.io";
import { Game } from "../../src/types/Game";

export const handleEndRound = (game: Game) => {
  // Perform Hand Analysis

  // Perform Chip adjustments
  // Round winner chips += potSize

  /*
 End Round -> Rating: 1) Matt, 2) Sri, 3) Kev, 4) Josh
 Total pot = 600
 Matts split = 438
 Sri split = 480
 Kev/Josh have no split
              Matt can only win his split - > 438
                new pot = 600 - 438 = 162
              Sri could have won 480, buttttt 438 was already won -> 480 - 438 = 42
                new pot = 162 - 42 = 120
              Kev wins 120
                new pot = 0
              Josh wins 0 
  */

  // Undeal/remove Cards

  // Return the updated game
  return game;
};
