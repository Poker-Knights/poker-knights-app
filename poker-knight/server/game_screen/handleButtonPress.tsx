import { Game, Player } from "../../src/types/Game";

export const handleButtonPress = (
  game: Game,
  buttonPressed: string,
  betValue: number
) => {
  // Handle button presses
  // CallLogic
  const curPlayer = game.players[game.currentPlayer - 1]; // Get current player
  if (buttonPressed === "call") {
    const call_diff = game.currentBet - curPlayer.lastBet;
    curPlayer.money -= call_diff; // Reflect bet
    curPlayer.lastBet = game.currentBet; // Update last bet
    game.potSize += call_diff; // Update Pot Value
    curPlayer.lastTurnCheckFG = false;
    game = nextPlayer(game); // Move to next player
    return game;

    // Fold logic
  } else if (buttonPressed === "fold") {
    // Implement the fold action logic here
    curPlayer.foldFG = true;
    game = nextPlayer(game); // Move to next player

    // Check Logic
  } else if (buttonPressed === "check") {
    // Implement the check action logic here
    curPlayer.lastBet = 0;
    game.checkCounter++;
    curPlayer.lastTurnCheckFG = true;
    game = nextPlayer(game); // Move to next player

    // Raise logic
  } else if (buttonPressed == "raise") {
    // Implement the raise action logic here
    if (curPlayer.money >= betValue) {
      curPlayer.money -= betValue; // Reflect bet
      curPlayer.lastBet = betValue; // Update last bet
      game.currentBet = betValue; // Update current game bet to new value
      game.potSize += game.currentBet; // Update Pot Value
      curPlayer.lastTurnCheckFG = false;
    }

    game = nextPlayer(game); // Move to next player
  } // All-in logic
  else if (buttonPressed === "all-in") {
    //const call_diff = betValue - curPlayer.lastBet;
    game.potSize += curPlayer.money;
    curPlayer.lastBet += curPlayer.money; // Update last bet
    curPlayer.money = 0; // Reflect bet
    if (curPlayer.lastBet > game.currentBet)
      game.currentBet = curPlayer.lastBet; // Set current bet to players worth
    curPlayer.allInFg = true; // Player is all in
    game = nextPlayer(game); // Move to next player
  }
  curPlayer.lastTurnCheckFG = false;
  return game;
};

// Function to handle a player's turn, return player
export const nextPlayer = (game: Game) => {
  // Logic to handle player's turn

  // Ctr variable should be re-defined for each time nextPlayer() is called,
  // therefore, there should never be a wrong break in the while loop.
  let ctr = 0;
  game.players[game.currentPlayer - 1].currentTurn = false; // Set previous current player turn to false

  let curPlayer = game.currentPlayer + 1;
  if (curPlayer === game.playerCount + 1) curPlayer = 1;
  while (
    game.players[curPlayer - 1].foldFG ||
    game.players[curPlayer - 1].eliminated
  ) {
    curPlayer = (curPlayer + 1) % (game.playerCount + 1);
    if (curPlayer === 0) curPlayer = 1;
    ctr++;

    // This is to make sure we are not stuck in an infinite while loop, since
    // if all players have foldFG set to true, the while loop will never break.
    // (If this isn't a potential issue, remove this if statement and the ctr variable's declaration.)
    if (ctr === game.playerCount) break;
  }
  game.currentPlayer = curPlayer;
  game.players[game.currentPlayer - 1].currentTurn = true; // Set new current player turn to true

  return game;
};

export const dispGame = (game: Game) => {
  console.log("-------------------------------------");
  console.log(
    "Current Round: " +
      game.roundCount +
      " Current Betting Round: " +
      game.curBettingRound
  );
  console.log("Pot Size: " + game.potSize + " Current Bet: " + game.currentBet);
  console.log(
    "Current Player: " +
      game.currentPlayer +
      " Number Players: " +
      game.playerCount
  );
  game.players.forEach((player) => {
    console.log(
      "Player: " +
        player.name +
        " Last bet: " +
        player.lastBet +
        " $" +
        player.money +
        " Turn: " +
        player.currentTurn +
        " Folded: " +
        player.foldFG +
        " All-in: " +
        player.allInFg +
        " Eliminated: " +
        player.eliminated
    );
  });
  console.log("-------------------------------------");
};
