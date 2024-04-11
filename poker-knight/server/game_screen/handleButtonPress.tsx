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
      // set button press to all in
      buttonPressed = "all-in";
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
    const curPlayer = game.players[game.currentPlayer - 1]; // Get current player
    curPlayer.lastBet = 0;
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

        buttonPressed = "all-in";
      }
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
    curPlayer.allInFg = true; // Player is all in

    game = nextPlayer(game); // Move to next player
  }
  return game;
};

// Function to handle a player's turn, return player
export const nextPlayer = (game: Game) => {
  // Logic to handle player's turn
  game.players[game.currentPlayer - 1].currentTurn = false; // Set current player turn to true

  let curPlayer = game.currentPlayer + 1;
  if (curPlayer === 5) curPlayer = 1;
  while (game.players[curPlayer - 1].foldFG) {
    curPlayer = (curPlayer + 1) % (game.playerCount + 1);
    if (curPlayer === 0) curPlayer = 1;
  }
  game.currentPlayer = curPlayer;
  game.players[game.currentPlayer - 1].currentTurn = true; // Set current player turn to true

  return game;
};
