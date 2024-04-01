import { Game, Player } from "../../src/types/Game";

// Function to create a new player and add to the specified game
export const handleCreateAndAddPlayer = (
  username: string,
  socketId: string,
  game: Game
) => {
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
    isBigBlind: false,
    isLittleBlind: false,
    splitPotVal: 0,
  };

  // Add the new player to the game
  game.players.push(newPlayer);
  game.playerCount++; // Update player count
};
