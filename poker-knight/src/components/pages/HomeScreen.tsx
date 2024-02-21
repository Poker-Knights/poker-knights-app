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

const Join = ({ navigation }: Props) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Set this to false to hide the navigation bar
    });
  }, [navigation]);

  const [gameID, setGameID] = useState("");

  const handleHostGamePress = () => {
    // Implement what happens when the user presses the join button
    console.log("Host Game"); // For now, we'll just log the game ID
    //navigation.navigate("CreateGameLogic");
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
          source={require("../../Graphics/knight.png")}
          style={styles.knightIcon}
          resizeMode="contain" // This will make sure the entire icon is visible
        />
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleHostGamePress}
          activeOpacity={0.7} // Reduce the opacity on press for visual feedback
        >
          <Image
            source={require("../../Graphics/longButton.png")}
            style={styles.buttonImage}
            resizeMode="contain"
          />
          <Text style={styles.buttonText}>HOST GAME</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleJoinGamePress}
          activeOpacity={0.7} // Reduce the opacity on press for visual feedback
        >
          <Image
            source={require("../../Graphics/longButton.png")}
            style={styles.buttonImage}
            resizeMode="contain"
          />
          <Text style={styles.buttonText}>JOIN GAME</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleSettingsPress}
          activeOpacity={0.7} // Reduce the opacity on press for visual feedback
        >
          <Image
            source={require("../../Graphics/longButton.png")}
            style={styles.buttonImage}
            resizeMode="contain"
          />
          <Text style={styles.buttonText}>SETTINGS</Text>
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
    justifyContent: "flex-start", // Align content to the top
    paddingTop: 30, // Adjust as needed to move everything up
  },
  knightContainer: {
    marginTop: 38,
  },
  knightIcon: {
    height: 285,
    width: 285,
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: "80%", // Same width as the input field
    height: 50, // Adjust as needed
    justifyContent: "center", // Center the text vertically
    alignItems: "center", // Center the text horizontally
    //overflow: "hidden", // Prevent the image from going outside the button area
  },
  buttonImage: {
    ...StyleSheet.absoluteFillObject, // Position the image absolutely to cover the whole button area
    width: "100%",
    height: "100%",
  },
  buttonText: {
    fontSize: 24, // Adjust as needed
    fontFamily: "PixeloidMono",
    color: "#292626", // Adjust text color to be visible against button background
    position: "absolute", // Position the text over the image
  },
  longButton: {
    height: 50, // Height of your button PNG
    width: "80%", // Width as a percentage of the screen width
    // Add more styles if needed
  },
});

export default Join;
