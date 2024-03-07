// util/Game.tsx
import { Player, Game } from "../types/Game";
import React from 'react';
import { Image, StyleSheet } from 'react-native';

const initializePlayers = (): Player[] => {
  return [
    {
      id: "1",
      name: "PLAYER 1",
      money: 0,
      currentTurn: true,
    },
    {
      id: "2",
      name: "PLAYER 2",
      money: 0,
      currentTurn: false,
    },
    {
      id: "3",
      name: "PLAYER 3",
      money: 0,
      currentTurn: false,
    },
  ];
};

const cardImages = {
  'ace_of_spades': require('./assets/cards/ace_of_spades.png'),
  'two_of_hearts': require('./assets/cards/two_of_hearts.png'),
  // ... other cards
};


// Assuming you have an 'assets/cards' directory with images named 'ace_of_spades.png', 'two_of_hearts.png', etc.
const Card = ({ value, suit }: {value: string; suit: string}) => {
  // Convert the value and suit to a file name
  // const imageName = `${value}.png`.toLowerCase();
  const imageSource = require(`../Graphics/Cards/${suit.toLowerCase}/${value.toLowerCase}`);

  return (
    <Image source={imageSource} style={styles.card} />
  );
};

const styles = StyleSheet.create({
  card: {
    width: 100,  // Set the width of the card
    height: 150, // Set the height of the card
    resizeMode: 'contain', // Keep the aspect ratio
  }
});

// export default Card;


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

const renderPlayerCards = (card1: string, card2: string) => {

}

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

// Export each function separately
export {
  Card,
  initializePlayers,
  createAndAddPlayer,
  handlePlayerTurn,
  updatePot,
  placeBet,
  handleAllInPress,
  handleCallPress,
  handleCheckPress,
  handleFoldPress,
  handleRaisePress,
};
