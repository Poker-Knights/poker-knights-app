import { Server } from "socket.io";
import { Game, Player } from "../../src/types/Game";
import { returnWinners, resetCards } from "./cardUtils";

export const handleEndRound = (io: Server, gameID: string, game: Game) => {
  // Perform Hand Analysis
  let winners: {
    username: string;
    rank: number;
    cardArray: string[];
    descr: string;
  }[] = [];

  // Find the winners
  winners = returnWinners(game);

  let winningHandDescription = winners[0].descr;
  let winningUsername = winners[0].username;

  // Round winner chips += potSize
  let payouts = game.potSize;
  let paidout = 0;

  // Find the winning player if they are not already eliminated
  let winPlayer1: Player = game.players.find(
    (p) => p.name === winners[0].username
  )!;
  let winPlayer2: Player = game.players.find(
    (p) => p.name === winners[1].username
  )!;
  let winPlayer3: Player = game.players.find(
    (p) => p.name === winners[2].username
  )!;
  let winPlayer4: Player = game.players.find(
    (p) => p.name === winners[3].username
  )!;

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

  // Undeal/remove Cards
  resetCards(game);

  setTimeout(() => {
    // Set the winner's isWinner flag to true
    winPlayer1.isRoundWinner = true;

    // Emit the winner to the client
    io.to(gameID).emit(
      "handledWinner",
      winningUsername,
      winningHandDescription
    );
  }, 250);

  game.roundCount++;

  // Return the updated game
  return game;
};
