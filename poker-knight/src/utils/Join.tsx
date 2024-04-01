// Functions to help with the Join component

import { Socket } from "socket.io-client";
import { Game } from "../types/Game";
import { NavigationHelpersContext } from "@react-navigation/native";

// Event emitters, helper functions, button presses
export const handleJoinPress = (
  socketRef: React.RefObject<any>,
  username: string,
  gameID: string
) => {
  // Implement what happens when the user presses the join button

  // verify that the gameID is valid
  if (socketRef.current) {
    console.log("Attempting to join game with id: " + gameID);
    socketRef.current.emit("attemptToJoin", gameID, username);
  }
};

export const handleBackPress = (navigation: any) => {
  console.log("Back Arrow Pressed");
  // disconnect from the socket
  navigation.navigate("Home");
};

// Event listener helper functions

// Example event handler for when a game is successfully joined
export const handleGameJoined =
  (navigation: any, username: string, socketRef: React.RefObject<any>) => (data: any) => {
    const joiningGame: Game = data.gameState;
    console.log("Attempting to join game, game data: " + joiningGame);
    navigation.navigate("Loading", { username, Game: joiningGame });
  };

// Example event handler for when a game is not found
export const handleGameNotFound = () => (data: any) => {
  alert("Game not found or full. Please try again.");
};

// Example event handler for when a username is taken
export const handleUsernameTaken = () => (data: any) => {
  alert("Username is already taken. Please try again.");
};
