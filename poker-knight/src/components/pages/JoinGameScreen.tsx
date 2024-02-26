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

  const handleJoinPress = () => {
    // Implement what happens when the user presses the join button
    console.log(gameID); // For now, we'll just log the game ID
    navigation.navigate("Game");
  };

  const handleBackPress = () => {
    console.log("Back Arrow Pressed");
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>READY?</Text>
        <Text style={styles.subtitle}>ENTER GAME ID </Text>
        <Text style={styles.subtitle}>BELOW! </Text>
        <Text style={styles.subtitle}> </Text>
      </View>

      {/* <View style={styles.knightContainer}>
        <Image
          source={require("../../Graphics/knight.png")}
          style={styles.knightIcon}
          resizeMode="contain" // This will make sure the entire icon is visible
        />
      </View> */}

      <View style={styles.gameIDContainer}>
        <TextInput
          style={styles.gameIDInput}
          textAlign={'center'}
          keyboardType="numeric"
          onChangeText={setGameID}
          maxLength={4} // Placeholder
          value={gameID}
          placeholder="Game ID"
          placeholderTextColor="#a9a9a9" // Placeholder text color
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleJoinPress}
          activeOpacity={0.7} // Reduce the opacity on press for visual feedback
        >
          <Image
            source={require("../../Graphics/longButton.png")}
            style={styles.buttonImage}
            resizeMode="contain"
          />
          <Text style={styles.buttonText}>Enter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.backButton}>
        <TouchableOpacity
          // style={}
          onPress={handleBackPress}
          activeOpacity={0.7} // Reduce the opacity on press for visual feedback
        >
          <Image
            source={require("../../Graphics/backArrow.png")}
            style={styles.arrowImage}
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
    justifyContent: "flex-start", // Align content to the top
    paddingTop: 30, // Adjust as needed to move everything up
  },

  titleContainer: {
    alignItems: "center",
    marginTop: 16, // Adjust as needed for spacing from the top
  },
  title: {
    fontSize: 52,
    fontFamily: "PixeloidMono",
    color: "#faca0f",
    marginBottom: 16, // Reduce the space below the 'READY?' text
  },
  subtitle: {
    fontSize: 24,
    fontFamily: "PixeloidMono",
    color: "#faca0f",
    marginBottom: 4, // Increase as needed for spacing above the knight icon
  },

  knightContainer: {
    marginTop: 5,
  },
  knightIcon: {
    height: 285,
    width: 285,
  },

  gameIDContainer: {
    marginTop: 20, // Adjust as needed for spacing
    alignItems: "center", // Center children horizontally
    width: "100%", // Take up full container width
  },
  gameIDInput: {
    height: 70, // Adjust as needed
    width: "80%", // Match the width of the button
    backgroundColor: "#fff", // Background color for the input
    borderRadius: 5, // Rounded corners for the input
    paddingHorizontal: 10, // Inner spacing
    fontSize: 18, // Adjust as needed
    fontFamily: "PixeloidMono",
    color: "#000", // Text color
    marginBottom: 30, // Space between input and button
  },
  buttonContainer: {
    width: "80%", // Same width as the input field
    height: 50, // Adjust as needed
    justifyContent: "center", // Center the text vertically
    alignItems: "center", // Center the text horizontally
    overflow: "hidden", // Prevent the image from going outside the button area
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

  backButton: {
    position: "absolute", // Position it over everything else
    left: 10, // Spacing from the left side of the screen
    bottom: 10, // Spacing from the bottom of the screen
  },

  arrowImage: {
    height: 50, // Adjust as needed for your image
    width: 50, // Adjust as needed for your image
    // If the image is not displaying correctly, you may remove the resizeMode or adjust it
  },
});

export default Join;
