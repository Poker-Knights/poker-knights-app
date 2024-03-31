import { Alert } from "react-native";
import { Game } from "../types/Game";
import { NavigationHelpersContext } from "@react-navigation/native";

// Event emitters, helper functions, button presses
export const createGame = (
  hostUsername: string,
  socketRef: React.RefObject<any>,
  setGameId: (id: string) => void
) => {
  const newGameID = Math.floor(100000 + Math.random() * 900000).toString();
  setGameId(newGameID);

  if (socketRef.current) {
    socketRef.current.emit("createGame", newGameID, hostUsername);
    console.log("socket createGame emitted to server with ID: " + newGameID);
  }
};

export const handleHostGamePress = (
  username: string,
  createGameFunction: Function
) => {
  if (username.length <= 8 && username.length > 0) {
    createGameFunction(username);
  } else {
    Alert.alert(
      "Invalid Username",
      "Username must be between 1 and 8 characters"
    );
  }
};

// Assuming `navigation` is from `useNavigation` in react-navigation
export const handleJoinGamePress = (username: string, navigation: any) => {
  if (username.length <= 8 && username.length > 0) {
    navigation.navigate("Join", { username });
  } else {
    Alert.alert(
      "Invalid Username",
      "Username must be between 1 and 8 characters"
    );
  }
};

export const handleSettingsPress = (
  setMenuVisible: (visible: boolean) => void
) => {
  console.log("Settings");
  setMenuVisible(true);
};

// Event listeners and their helper functions
export const handleGameCreated =
  (
    setGame: (game: Game) => void,
    navigation: any,
    socketRef: React.RefObject<any>
  ) =>
  (data: any) => {
    const newGame: Game = data.gameState;
    const username: string = data.username;
    console.log(
      `Client Side - Game ${newGame.id} has been created with username ${newGame.players[0].name}!`
    );
    setGame(newGame); // Update the game state with the new game information
    
    
    // Navigate to loading screen until enough players
    navigation.navigate("Game", {
      Game: newGame,
      username: newGame.hostPlayer,
    });
  };
