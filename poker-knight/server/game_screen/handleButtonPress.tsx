import { Game, Player } from "../../src/types/Game";

export const handleButtonPress = (
  game: Game,
  buttonPressed: string,
  betValue: number
) => {
  // Handle button presses
  // CallLogic
  
  if (buttonPressed === "call") {
    const curPlayer = game.players[game.currentPlayer - 1]; // Get current player

    if (curPlayer.money >= game.currentBet) {
      curPlayer.money -= game.currentBet; // Reflect bet
      curPlayer.lastBet = game.currentBet; // Update last bet
      game.potSize += game.currentBet; // Update Pot Value
    } else {
      curPlayer.allInFg = true; // Player is all in
      // All in logic
    }

    game = nextPlayer(game); // Move to next player

    return game;

    // Fold logic
  } else if (buttonPressed === "fold") {
    // Implement the fold action logic here
    const curPlayer = game.players[game.currentPlayer - 1]; // Get current player
    curPlayer.foldFG = true;
    game = nextPlayer(game); // Move to next player

    // Check Logic
  } else if (buttonPressed === "check") {
    // Implement the check action logic here
    game = nextPlayer(game); // Move to next player

    // Raise logic
  } else if (buttonPressed == "raise") {
    // Implement the raise action logic here
    const curPlayer = game.players[game.currentPlayer - 1]; // Get current player

    if (curPlayer.money >= betValue) {
      curPlayer.money -= betValue; // Reflect bet
      curPlayer.lastBet = betValue; // Update last bet
      game.currentBet = betValue; // Update current game bet to new value
      game.potSize += game.currentBet; // Update Pot Value
      if (curPlayer.money === betValue) {
        curPlayer.allInFg = true; // Player is all in
        // All in logic
      }
    } else {
      // Logic for player doesnt have enough to bet
    }

    game = nextPlayer(game); // Move to next player
  }

  // All-in logic
  if (buttonPressed === "all-in") {
    // Implement the all-in action logic here
    const curPlayer = game.players[game.currentPlayer - 1]; // Get current player
    game.currentBet = curPlayer.money; // Set current bet to players worth
    curPlayer.lastBet = curPlayer.money; // Update last bet
    curPlayer.money = 0; // Empty players money
    game.potSize += game.currentBet; // Update Pot Value
    game = nextPlayer(game); // Move to next player
  }
  return game;
};

// Function to handle a player's turn, return player
const nextPlayer = (game: Game) => {
  // Logic to handle player's turn
  game.players[game.currentPlayer - 1].currentTurn = false; // Set current player turn to true

  const curPlayer = game.currentPlayer + 1;

  if (curPlayer <= game.playerCount) {
    game.currentPlayer++;
    game.players[game.currentPlayer - 1].currentTurn = true; // Set current player turn to true
  }
  else {
    game.currentPlayer = 1;
    game.players[game.currentPlayer - 1].currentTurn = true; // Reset last bet
  }

  return game;
};
