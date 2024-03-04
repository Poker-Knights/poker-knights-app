import React, { useEffect, useRef, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "../../../App";
import {
  StatusBar,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  LogBox,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import io, { Socket } from 'socket.io-client';
import {SERVER_URL} from '../../utils/socket';

type Props = {
  navigation: StackNavigationProp<StackParamList, "Join">;
};

import { Game, Player } from "../../types/Game";
import { PopupMenu } from "./Settings"; // Import PopupMenu
import { initializePlayers, playerCount } from "../../utils/Game";

const Home = ({ navigation }: Props) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Set this to false to hide the navigation bar
    });
  }, [navigation]);

  const [username, setUsername] = useState("");
  const [gameId, setGameId] = useState("");
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [game, setGame] = useState<Game | null>(null);
  const socketRef = useRef<Socket | null>(null)


  // useEffect is a hook that runs after the first render of the component
  // It is used to perform side effects like data fetching, subscriptions, or manual DOM manipulations
  // It runs after the render has been committed to the screen
  // It is safe to perform side effects in this function
  // Allows re renders of the component to be skipped if the props or state haven't changed
  // such as when the user is typing in the input field, the component doesn't need to re render


  // Set up socket connection and event listeners
  useEffect(() => {
    socketRef.current = io(SERVER_URL, { transports: ['websocket'] });

    // Event listener for 'gameCreated' event
    const handleGameCreated = (data: any) => {

        const newGame : Game = data.gameState;
        console.log(`Game ${newGame.id} has been created with username ${newGame.players[0].name}!`); 
        setGame(game); // Update the game state
      // Navigate to loading screen until enough players
      // navigation.navigate("Loading", { Game: newGame });
    };

    if (socketRef.current) {
      socketRef.current.on('gameCreated', handleGameCreated);
    }

    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off('gameCreated', handleGameCreated);
        socketRef.current.disconnect();
      }
    };
  }, [navigation]);




  // Create a game function
  const createGame = (hostUsername: string) => {
    // Generate a new 6 digit game ID
    const newGameID = Math.floor(100000 + Math.random() * 900000).toString();
    setGameId(newGameID); // Update state with newGameID, won't be updated immediately

    // Check if the socket is connected
    if (socketRef.current) {
      // Emit the 'createGame' event with the new game ID
      socketRef.current.emit('createGame', { gameID: newGameID, username: hostUsername });
      console.log("socket createGame emitted to server with ID: " + newGameID);
    }
  };


  const handleHostGamePress = () => {
    // Implement what happens when the user presses the join button
    console.log("Host Game"); // For now, we'll just log the game ID

    
    // Connect to server
    if (username.length <= 8 && username.length > 0) {
      console.log("Username is valid");
      createGame(username);
    }
    else{
      Alert.alert("Invalid Username", "Username must be between 1 and 8 characters");
    }
  };


  const handleJoinGamePress = () => {
    // Implement what happens when the user presses the join button
    console.log("Join Game"); // For now, we'll just log the game ID

    // Here game may not exist just pass the username to next screen
    navigation.navigate("Join", { username: username });
  };

  const handleSettingsPress = () => {
    // Implement what happens when the user presses the join button
    console.log("Settings"); // For now, we'll just log the game ID
    setMenuVisible(true);
    //navigation.navigate("Settings");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />

      <View style={styles.modalView}>
        <PopupMenu
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
        />
      </View>

      <View style={styles.knightContainer}>
        <Image
          source={require("../../Graphics/PKLogo.png")}
          style={styles.knightIcon}
          resizeMode="contain" // This will make sure the entire icon is visible
        />
      </View>
      <View style={styles.usernameContainer}>
        <TextInput
          style={styles.usernameInput}
          textAlign={"center"}
          onChangeText={setUsername}
          value={username}
          placeholder="Username"
          placeholderTextColor="#a9a9a9" // Placeholder text color
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleHostGamePress}
          activeOpacity={0.7} // Reduce the opacity on press for visual feedback
        >
          <Image
            source={require("../../Graphics/HostGameButton.png")}
            style={styles.buttonImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleJoinGamePress}
          activeOpacity={0.7} // Reduce the opacity on press for visual feedback
        >
          <Image
            source={require("../../Graphics/JoinGameButton.png")}
            style={styles.buttonImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleSettingsPress}
          activeOpacity={0.7} // Reduce the opacity on press for visual feedback
        >
          <Image
            source={require("../../Graphics/SettingsButton.png")}
            style={styles.buttonImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#292626",
    alignItems: "center",
    justifyContent: "center", // Center content vertically
    paddingTop: 10, // Adjust as needed to move everything up
  },
  knightContainer: {
    marginTop: 0,
  },
  knightIcon: {
    height: 350,
    width: 350,
  },
  buttonsContainer: {
    flex: 1,
    marginTop: 5,
    width: "100%", // Ensure the container takes up the full width
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  buttonContainer: {
    width: "100%", // Adjust the width percentage as needed
    height: 50, // Adjust as needed
    marginVertical: 15, // Add margin between buttons
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  buttonImage: {
    width: "100%", // Ensure the image takes up the full width of the button
    height: "140%", // Ensure the image takes up the full height of the button
  },
  usernameContainer: {
    marginTop: 35, // Adjust as needed for spacing
    alignItems: "center", // Center children horizontally
    width: "100%", // Take up full container width
  },
  usernameInput: {
    height: 70, // Adjust as needed
    width: "80%", // Match the width of the button
    backgroundColor: "#fff", // Background color for the input
    borderRadius: 5, // Rounded corners for the input
    paddingHorizontal: 10, // Inner spacing
    fontSize: 24, // Adjust as needed
    fontFamily: "PixeloidMono",
    color: "#000", // Text color
    marginBottom: 10, // Space between input and button
  },
  modalView: {
    alignItems: "center",
  },
});

export default Home;
function setGameId(arg0: string) {
  throw new Error("Function not implemented.");
}

