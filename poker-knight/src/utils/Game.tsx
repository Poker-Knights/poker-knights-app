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

// type CardImages = {
//   [key: string]: any;
// };

// const cardImages: CardImages = {
//   // Spades
//   'spades_2': require('../Graphics/Cards/spades/2.png'),
//   'spades_3': require('../Graphics/Cards/spades/3.png'),
//   'spades_4': require('../Graphics/Cards/spades/4.png'),
//   'spades_5': require('../Graphics/Cards/spades/5.png'),
//   'spades_6': require('../Graphics/Cards/spades/6.png'),
//   'spades_7': require('../Graphics/Cards/spades/7.png'),
//   'spades_8': require('../Graphics/Cards/spades/8.png'),
//   'spades_9': require('../Graphics/Cards/spades/9.png'),
//   'spades_T': require('../Graphics/Cards/spades/T.png'),
//   'spades_J': require('../Graphics/Cards/spades/J.png'),
//   'spades_Q': require('../Graphics/Cards/spades/Q.png'),
//   'spades_K': require('../Graphics/Cards/spades/K.png'),
//   'spades_A': require('../Graphics/Cards/spades/A.png'),

//   // Hearts
//   'hearts_2': require('../Graphics/Cards/hearts/2.png'),
//   'hearts_3': require('../Graphics/Cards/hearts/3.png'),
//   'hearts_4': require('../Graphics/Cards/hearts/4.png'),
//   'hearts_5': require('../Graphics/Cards/hearts/5.png'),
//   'hearts_6': require('../Graphics/Cards/hearts/6.png'),
//   'hearts_7': require('../Graphics/Cards/hearts/7.png'),
//   'hearts_8': require('../Graphics/Cards/hearts/8.png'),
//   'hearts_9': require('../Graphics/Cards/hearts/9.png'),
//   'hearts_T': require('../Graphics/Cards/hearts/T.png'),
//   'hearts_J': require('../Graphics/Cards/hearts/J.png'),
//   'hearts_Q': require('../Graphics/Cards/hearts/Q.png'),
//   'hearts_K': require('../Graphics/Cards/hearts/K.png'),
//   'hearts_A': require('../Graphics/Cards/hearts/A.png'),

//   // Diamonds
//   'diamonds_2': require('../Graphics/Cards/diamonds/2.png'),
//   'diamonds_3': require('../Graphics/Cards/diamonds/3.png'),
//   'diamonds_4': require('../Graphics/Cards/diamonds/4.png'),
//   'diamonds_5': require('../Graphics/Cards/diamonds/5.png'),
//   'diamonds_6': require('../Graphics/Cards/diamonds/6.png'),
//   'diamonds_7': require('../Graphics/Cards/diamonds/7.png'),
//   'diamonds_8': require('../Graphics/Cards/diamonds/8.png'),
//   'diamonds_9': require('../Graphics/Cards/diamonds/9.png'),
//   'diamonds_T': require('../Graphics/Cards/diamonds/T.png'),
//   'diamonds_J': require('../Graphics/Cards/diamonds/J.png'),
//   'diamonds_Q': require('../Graphics/Cards/diamonds/Q.png'),
//   'diamonds_K': require('../Graphics/Cards/diamonds/K.png'),
//   'diamonds_A': require('../Graphics/Cards/diamonds/A.png'),

//   // Clubs
//   'clubs_2': require('../Graphics/Cards/clubs/2.png'),
//   'clubs_3': require('../Graphics/Cards/clubs/3.png'),
//   'clubs_4': require('../Graphics/Cards/clubs/4.png'),
//   'clubs_5': require('../Graphics/Cards/clubs/5.png'),
//   'clubs_6': require('../Graphics/Cards/clubs/6.png'),
//   'clubs_7': require('../Graphics/Cards/clubs/7.png'),
//   'clubs_8': require('../Graphics/Cards/clubs/8.png'),
//   'clubs_9': require('../Graphics/Cards/clubs/9.png'),
//   'clubs_T': require('../Graphics/Cards/clubs/T.png'),
//   'clubs_J': require('../Graphics/Cards/clubs/J.png'),
//   'clubs_Q': require('../Graphics/Cards/clubs/Q.png'),
//   'clubs_K': require('../Graphics/Cards/clubs/K.png'),
//   'clubs_A': require('../Graphics/Cards/clubs/A.png'),
// };


// Assuming you have an 'assets/cards' directory with images named 'ace_of_spades.png', 'two_of_hearts.png', etc.
const Card = ({ value, suit }: {value: string; suit: string}) => {
  // Convert the value and suit to a file name
  // const imageName = `../Graphics/Cards/${suit.toLowerCase}/${value.toUpperCase}.png`;
  const imageName = `${suit.toLowerCase}_${value.toUpperCase}`

  const suitTEST = "hearts";
  const valueTEST = "2"
  // console.log(value + ", " + suit);
  // const imageSource = cardImages[imageName];
  const imageSource = require(`../Graphics/Cards/${suitTEST}/${valueTEST}.png`);
  // const imageSource = cardImages[`${suit}_${value}`];
  // const imageSource = require("../Graphics/Cards/hearts/2.png");
  
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
