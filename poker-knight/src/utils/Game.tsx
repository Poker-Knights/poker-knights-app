// util/Game.tsx
import { Player, Game } from "../types/Game";

// Function to get random but unique avatar and give to player
const generateAvatar = (players: Player[]): string => {
  // Get the number of players
  const defaultAvatar: string = require("../Graphics/userIcon.png");
  const avatarImages: { [key: string]: any } = {
    avatar1: require("../Graphics/knight.png"),
    avatar2: require("../Graphics/PKLogo.png"),
    avatar3: require("../Graphics/backArrow.png"),
    avatar4: require("../Graphics/longButton.png"),
    // Add all other avatars here
  };

  // Get the keys of the avatarImages object
  const avatarKeys = Object.keys(avatarImages);

  const playerCount = players.length;

  // Get a random index to select an avatar
  const randomIndex = Math.floor(Math.random() * avatarKeys.length);

  // Check if the selected avatar is already in use, if not, return it
  if (
    players.every(
      (player) => player.avatarUri !== avatarImages[avatarKeys[randomIndex]]
    )
  ) {
    return avatarImages[avatarKeys[randomIndex]];
  } else return defaultAvatar;
};

// Function to create a new player and add to the specified game
const createAndAddPlayer = (username: string, socketId: string, game: Game) => {
  // call generateAvatar here

  const newPlayer: Player = {
    id: socketId,
    name: username,
    money: 500, // Default starting money
    allInFg: false,
    //avatarUri: generateAvatar(game.players), // Call the generateAvatar function here
    currentTurn: false, // Set initial turn status
    lastBet: 0,
    fold: false,
    isLittleBlind: false,
    isBigBlind: false,
  };

  // Add the new player to the game
  game.players.push(newPlayer);
  game.playerCount++; // Update player count

  return newPlayer; // Return the new player object for any further use
};

// Handle button presses
const handleCallPress = (game: Game) => {
  console.log("Call action");
  // Implement the call action logic here
  const curPlayer = game.players[game.currentPlayer - 1]; // Get current player
  if (curPlayer.money >= game.currentBet)
    curPlayer.money -= game.currentBet; // Reflect bet
  else {
    curPlayer.allInFg = true; // Player is all in
    // All in logic
  }
  curPlayer.lastBet = game.currentBet; // Update last bet
  game.potSize += game.currentBet; // Update Pot Value
  nextPlayer(game); // Move to next player
};

const handleFoldPress = (game: Game) => {
  console.log("Fold action");
  // Implement the fold action logic here
  const curPlayer = game.players[game.currentPlayer - 1]; // Get current player
  curPlayer.fold = true;
  nextPlayer(game); // Move to next player
};

const handleCheckPress = (game: Game) => {
  console.log("Check action");
  // Implement the check action logic here
  nextPlayer(game); // Move to next player
};

const handleRaisePress = (game: Game, betValue: number) => {
  console.log("Raise action");
  // Implement the raise action logic here
  const curPlayer = game.players[game.currentPlayer - 1]; // Get current player
  if (curPlayer.money >= betValue) curPlayer.money -= betValue; // Reflect bet
  else {
    curPlayer.allInFg = true; // Player is all in
    // All in logic
  }
  curPlayer.lastBet = betValue; // Update last bet
  game.currentBet = betValue; // Update current game bet to new value
  game.potSize += game.currentBet; // Update Pot Value
  nextPlayer(game); // Move to next player
};

const handleAllInPress = (game: Game) => {
  console.log("All-in action");
  // Implement the all-in action logic here
  const curPlayer = game.players[game.currentPlayer - 1]; // Get current player
  game.currentBet = curPlayer.money; // Set current bet to players worth
  curPlayer.money = 0; // Empty players money
  game.potSize += game.currentBet; // Update Pot Value
  nextPlayer(game); // Move to next player
};

const handlePlayerTurn = (game: Game, player: Player) => {
  console.log("Handle Player Turn");
};

// Function to handle a player's turn, return player
const nextPlayer = (game: Game) => {
  // Logic to handle player's turn
  game.currentPlayer++;
  if (game.currentPlayer >= game.playerCount) game.currentPlayer = 1;
  console.log(game.currentPlayer);
  console.log(game.playerCount);
  console.log(game.players[game.playerCount - 1].money);
  console.log(game.players[game.playerCount - 1].lastBet);
  console.log(game.potSize);
};

// Export each function separately
export {
  createAndAddPlayer,
  handlePlayerTurn,
  handleAllInPress,
  handleCallPress,
  handleCheckPress,
  handleFoldPress,
  handleRaisePress,
};
