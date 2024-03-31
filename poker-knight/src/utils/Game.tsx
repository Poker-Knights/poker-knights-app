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
    lastBet: -1,
    foldFG: false,
    playerCards: ["back", "back"], // array to store player cards
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
const handleCallPress = (game: Game) => {
  const curPlayer = game.players[game.currentPlayer - 1]; // Get current player

  if (curPlayer.money >= game.currentBet) {
    curPlayer.money -= game.currentBet; // Reflect bet
    curPlayer.lastBet = game.currentBet; // Update last bet
    game.potSize += game.currentBet; // Update Pot Value
  } else {
    curPlayer.allInFg = true; // Player is all in
    // All in logic
  }

  nextPlayer(game); // Move to next player
};

const handleFoldPress = (game: Game) => {
  // Implement the fold action logic here
  const curPlayer = game.players[game.currentPlayer - 1]; // Get current player
  curPlayer.foldFG = true;
  nextPlayer(game); // Move to next player
};

const handleCheckPress = (game: Game) => {
  // Implement the check action logic here
  nextPlayer(game); // Move to next player
};

const handleRaisePress = (game: Game, betValue: number) => {
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

  nextPlayer(game); // Move to next player
};

const handleAllInPress = (game: Game) => {
  // Implement the all-in action logic here
  const curPlayer = game.players[game.currentPlayer - 1]; // Get current player
  game.currentBet = curPlayer.money; // Set current bet to players worth
  curPlayer.lastBet = curPlayer.money; // Update last bet
  curPlayer.money = 0; // Empty players money
  game.potSize += game.currentBet; // Update Pot Value
  nextPlayer(game); // Move to next player
};

// Function to handle a player's turn, return player
const nextPlayer = (game: Game) => {
  // Logic to handle player's turn
  game.currentPlayer++;
  if (game.currentPlayer >= game.playerCount) game.currentPlayer = 1;
};

const handleExitConfirmPress = (
  socketRef: React.RefObject<any>,
  gameID: string
) => {
  if (socketRef.current) {
    console.log(
      `Disconnecting player ${socketRef.current.id} from game ${gameID}`
    );

    const playerID = socketRef.current.id;

    socketRef.current.emit("exitGame", playerID, gameID);
  }
};

const handleExit =
  (navigation: any, socketRef: React.RefObject<any>, gameID: string) =>
  (data: any) => {
    if (socketRef.current) {
      socketRef.current.disconnect();

      console.log("Exit game was successful");

      navigation.navigate("Home");
    } else {
      console.log("Exit game was unsuccessful");
    }
  };

// Export each function separately
export {
  removePlayer,
  handleExitConfirmPress,
  handleExit,
  createAndAddPlayer,
  handleAllInPress,
  handleCallPress,
  handleCheckPress,
  handleFoldPress,
  handleRaisePress,
};
