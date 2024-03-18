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
    //avatarUri: generateAvatar(game.players), // Call the generateAvatar function here
    currentTurn: false, // Set initial turn status
  };

  // Add the new player to the game
  game.players.push(newPlayer);
  game.playerCount++; // Update player count

  return newPlayer; // Return the new player object for any further use
};

// Function to remove a player from the specified game
const removePlayer = (socketId: string, game: Game) => {
  console.log(`Current player count: ${game.playerCount}`);
  console.log(`Removing user: ${socketId} from player list`);

  // Iterate through all players in game
  for (let i = 0; i < game.playerCount; i++) {
    // If player at index i has the same id, then remove from players array
    if (game.players[i].id == socketId) {
      game.players.splice(i, 1); // 2nd parameter means remove one item only
      game.playerCount--; // Update player count
      break;
    }
  }

  console.log(`Updated players count: ${game.playerCount}`);

  return game.players; // Return players left in the game for any further use
};

// Handle button presses
const handleCallPress = () => {
  console.log("Call action");
  // Implement the call action logic here
};

const handleFoldPress = () => {
  console.log("Fold action");
  // Implement the fold action logic here
};

const handleCheckPress = () => {
  console.log("Check action");
  // Implement the check action logic here
};

const handleRaisePress = () => {
  console.log("Raise action");
  // Implement the raise action logic here
};

const handleAllInPress = () => {
  console.log("All-in action");
  // Implement the all-in action logic here
};

// Function to handle a player's turn, return player
const handlePlayerTurn = (playerId: string, players: Player[]) => {
  // Logic to handle player's turn
};

// Function to update the pot, return number
const updatePot = (newPotValue: number) => {
  // Logic to update the pot
};

// Function to place a bet
const placeBet = (playerId: string, betAmount: number, players: Player[]) => {
  // Logic to place a bet
};

const handleExitConfirmPress = (
  socketRef: React.RefObject<any>,
  gameID: string
) => {
  if (socketRef.current) {
    console.log(`Disconnecting player ${socketRef.current.id} from game ${gameID}`);
    
    const playerID = socketRef.current.id;

    socketRef.current.emit("exitGame", playerID, gameID);
  }
};

const handleExit = (
  navigation: any,
  socketRef: React.RefObject<any>,
  gameID: string
) => (data: any) => {
  if (socketRef.current) {
    socketRef.current.disconnect();

    console.log("Exit game was successful");
    
    navigation.navigate("Home");
  }
  else {
    console.log("Exit game was unsuccessful");
  }
};

// Export each function separately
export {
  createAndAddPlayer,
  removePlayer,
  handleExitConfirmPress,
  handleExit,
  handlePlayerTurn,
  updatePot,
  placeBet,
  handleAllInPress,
  handleCallPress,
  handleCheckPress,
  handleFoldPress,
  handleRaisePress,
};
