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
      const call_diff = game.currentBet - curPlayer.lastBet;
      if (curPlayer.isLittleBlind)
      {
        console.log("LITTLE BLIND LAST BET " + curPlayer.lastBet);
        console.log("CALL DIFFERENCE " + call_diff); 
        console.log(curPlayer.money)
      }

      curPlayer.money -= call_diff; // Reflect bet
      curPlayer.lastBet = game.currentBet; // Update last bet
      
      if(curPlayer.isLittleBlind) console.log(curPlayer.money);

      game.potSize += game.currentBet; // Update Pot Value
    } 
    else
    {
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

  // Ctr variable should be re-defined for each time nextPlayer() is called,
  // therefore, there should never be a wrong break in the while loop.
  let ctr = 0;
  game.players[game.currentPlayer - 1].currentTurn = false; // Set previous current player turn to false

  

  let curPlayer = game.currentPlayer + 1;
  if (curPlayer === 5) curPlayer = 1;
  while (game.players[curPlayer - 1].foldFG) {
    curPlayer = (curPlayer + 1) % (game.playerCount + 1);
    if (curPlayer === 0) curPlayer = 1;
    ctr++;

    // This is to make sure we are not stuck in an infinite while loop, since
    // if all players have foldFG set to true, the while loop will never break.
    // (If this isn't a potential issue, remove this if statement and the ctr variable's declaration.)
    if (ctr === game.playerCount)
      break;
  }
  game.currentPlayer = curPlayer;
  game.players[game.currentPlayer - 1].currentTurn = true; // Set new current player turn to true

  return game;
};
