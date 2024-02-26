import React, { useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "../../../App";

import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  navigation: StackNavigationProp<StackParamList, "Join">;
};

import { Player } from "../../types/Player";
import { initializePlayers, playerCount } from "../../utils/Game";

const Join = ({ navigation }: Props) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Set this to false to hide the navigation bar
    });
  }, [navigation]);

  const [username, setUsername] = useState("");
  const [gameId, setGameId] = useState("");

  const handleHostGamePress = () => {
    // Implement what happens when the user presses the join button
    console.log("Host Game"); // For now, we'll just log the game ID
    console.log(username);

    const players: Player[] = initializePlayers();
    // Assign the username to the first player
    players[0].name = username;

    // Generate Id for player
    players[0].id = Math.random().toString(36).substr(2, 9);

    // Assign player profile picture to the first player, avatarUri is a string
    players[0].avatarUri = "../Graphics/Knight1.png";

    // Increase total players
    playerCount.totalPlayers++;

    // Randomly generate 6 digit number as the ID
    setGameId(Math.floor(100000 + Math.random() * 900000).toString());
    console.log(gameId);

    // Upon creating game, there must be a way to recognize what network the player is on so other players can join, use socket.io
    // Make a placeholder function for this that is called from an import, passed the gameID
    //createGame(gameId);

    // Navigate to the game screen with all the updated info for players and game state if username entered
    if (username) {
      navigation.navigate("Game", {
        gameId: gameId,
      });
    } else {
      alert("Please enter a username");
    }
  };

  const handleJoinGamePress = () => {
    // Implement what happens when the user presses the join button
    console.log("Join Game"); // For now, we'll just log the game ID
    navigation.navigate("Join");
  };

  const handleSettingsPress = () => {
    // Implement what happens when the user presses the join button
    console.log("Settings"); // For now, we'll just log the game ID
    //navigation.navigate("Settings");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />

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
});

export default Join;
