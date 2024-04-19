import { Game, Player } from "../../src/types/Game";

// Function to create a new player and add to the specified game
export const handleCreateAndAddPlayer = (
  username: string,
  socketId: string,
  game: Game
) => {
  const avatarUri = generateAvatar(game.players); // call generateAvatar here

  const newPlayer: Player = {
    id: socketId,
    name: username,
    money: 500, // Default starting money
    allInFg: false,
    avatarUri: avatarUri, // Call the generateAvatar function here
    currentTurn: false, // Set initial turn status
    lastBet: -1,
    foldFG: false,
    isLittleBlind: false,
    isBigBlind: false,
    isRoundWinner: false,
    playerCards: [],
    splitPotVal: 0,
    eliminated: false,
    lastTurnCheckFG: false,
  };

  // Add the new player to the game
  game.players.push(newPlayer);
  game.playerCount++; // Update player count

  return game; // Return the new player object for any further use
};

// Function to get random but unique avatar and give to player
const generateAvatar = (players: Player[]): string => {
  // Get the number of players
  const defaultAvatar: string = "https://i.imgur.com/om832wf.png";
  const avatarImages: { [key: string]: any } = {
    avatar1: "https://i.imgur.com/3bP0BK0.png",
    avatar2: "https://i.imgur.com/hUCwjoo.png",
    avatar3: "https://i.imgur.com/qHv9k6L.png",
    avatar4: "https://i.imgur.com/KdByOkp.png",
    avatar5: "https://i.imgur.com/om832wf.png",
    // Add all other avatars here
  };

  // Get the keys of the avatarImages object
  const avatarKeys = Object.keys(avatarImages);

  // Filter out the avatars that are already in use
  const usedAvatars = new Set(players.map((player) => player.avatarUri));
  const availableAvatars = avatarKeys.filter(
    (key) => !usedAvatars.has(avatarImages[key])
  );

  // If no avatars are available, handle this case (e.g., return null or a default image)
  if (availableAvatars.length === 0) {
    return defaultAvatar; // or return a default image URL
  }

  // Select a random avatar from the remaining unused avatars
  const randomIndex = Math.floor(Math.random() * availableAvatars.length);
  return avatarImages[availableAvatars[randomIndex]];
};
