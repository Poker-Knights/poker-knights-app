import { Socket } from "socket.io";
import { Game, Player } from "../../src/types/Game";

export const handleEndRound = (game: Game) => {
  // Perform Hand Analysis
  let winners: string[] = [];

  // Round winner chips += potSize
  let payouts = game.potSize;
  let paidout = 0;
  let winPlayer1: Player = game.players.find((p) => p.name === winners[0])!;
  let winPlayer2: Player = game.players.find((p) => p.name === winners[1])!;
  let winPlayer3: Player = game.players.find((p) => p.name === winners[2])!;
  let winPlayer4: Player = game.players.find((p) => p.name === winners[3])!;

  // First place
  winPlayer1.money += winPlayer1.splitPotVal; // Pay them their winnings
  payouts -= winPlayer1.splitPotVal; // Subtract from winnings
  paidout += winPlayer1.splitPotVal;

  // Second place if needed
  if (payouts != 0) {
    let winnings = winPlayer2.splitPotVal - paidout;
    if (winnings > 0) {
      winPlayer2.money += winnings; // Pay them their winnings
      payouts -= winnings; // Subtract from winnings
      paidout += winnings;
    }
  }

  // Third place if needed
  if (payouts != 0) {
    let winnings = winPlayer3.splitPotVal - paidout;
    if (winnings > 0) {
      winPlayer3.money += winnings; // Pay them their winnings
      payouts -= winnings; // Subtract from winnings
      paidout += winnings;
    }
  }

  // Foruth place if needed
  if (payouts != 0) {
    let winnings = winPlayer4.splitPotVal - paidout;
    if (winnings > 0) {
      winPlayer4.money += winnings; // Pay them their winnings
      payouts -= winnings; // Subtract from winnings
      paidout += winnings;
    }
  }


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
