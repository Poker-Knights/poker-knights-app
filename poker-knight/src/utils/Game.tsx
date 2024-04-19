// util/Game.tsx
import { Alert } from "react-native";
import { Socket } from "socket.io-client";
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

// Function to remove a player from the specified game
const removePlayer = (socketId: string, game: Game) => {
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


  return game.players; // Return players left in the game for any further use
};
const handleExitConfirmPress = (
  socketRef: React.RefObject<any>,
  gameID: string
) => {
  if (socketRef.current) {

    socketRef.current.emit("exitGame", (gameID));
  }
};

const handleExit =
  (navigation: any, socketRef: React.RefObject<any>, gameID: string) =>
  (data: any) => {
    if (socketRef.current) {
      socketRef.current.disconnect();

      navigation.navigate("Home");
    } 
  };

// Export each function separately
export { removePlayer, handleExitConfirmPress, handleExit };
