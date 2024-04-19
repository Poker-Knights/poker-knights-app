import { Server } from "socket.io";
import { Game, Player } from "../../src/types/Game";
import { returnWinners, resetCards } from "./cardUtils";
import { PLAYER_COUNT } from "../../src/utils/socket";

export const handleEndRound = (io: Server, gameID: string, game: Game) => {
  console.log("HANDLING END ROUND");

  // Perform Hand Analysis
  let winners: {
    username: string;
    rank: number;
    cardArray: string[];
    descr: string;
  }[] = [];
  let players = game.players;
  let winPlayer: Player[] = [];

  // Find the winners
  winners = returnWinners(game);

  let winningHandDescription = winners[0].descr;
  let winningUsername = winners[0].username;

  // Round winner chips += potSize
  let payouts = game.potSize;
  let paidout = 0;

  players.forEach((player, index) => {
    winPlayer[index] = game.players.find(
      (p) => p.name === winners[index].username
    )!;
  });

  winPlayer.forEach((player, index) => {
    // If the player has been eliminated or they folded, make sure they don't get any winnings and move on to the next player
    if (player.eliminated || player.foldFG) return;

    if (player.name === winners[0].username) {
      winPlayer[index].money += winPlayer[index].splitPotVal;
      payouts -= winPlayer[index].splitPotVal;
      paidout += winPlayer[index].splitPotVal;

      // Set the winner's isWinner flag to true
      winPlayer[index].isRoundWinner = true;
      console.log(
        "Player: " +
          player.name +
          " Winnings " +
          winPlayer[index].splitPotVal +
          " Payouts " +
          payouts
      );
    }

    if (payouts != 0 && player.name !== winners[0].username) {
      let winnings = winPlayer[index].splitPotVal - paidout;
      if (winnings > 0) {
        winPlayer[index].money += winnings;
        payouts -= winnings;
        paidout += winnings;

        console.log(
          "After first winner - Player: " +
            player.name +
            " Winnings " +
            winnings
        );
      }
    }
  });

  game.potSize = 0;
  game.currentBet = 0;

  // If a players money falls at or below zero they are eliminated
  game.players.forEach((player) => {
    if (player.money <= 0) {
      player.eliminated = true;
    }
  });

  // Iterate through the players and if 3 eliminated, set gameWon to true
  let eliminatedPlayers = 0;
  game.players.forEach((player) => {
    if (player.eliminated) {
      eliminatedPlayers++;
    }
  });

  if (eliminatedPlayers === PLAYER_COUNT - 1) {
    game.gameWon = true;
  }

  // Emit the winner to the client
  io.to(gameID).emit(
    "handledWinner",
    game,
    winningUsername,
    winningHandDescription
  );

  // Undeal/remove Cards
  resetCards(game);

  // add delay before returning the game
  for (let i = 0; i < 6000000000; i++) {
    // do nothing
  }

  game.roundCount++;

  // Return the updated game
  return game;
};
