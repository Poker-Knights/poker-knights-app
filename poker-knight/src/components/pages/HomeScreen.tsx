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
          source={require("../../Graphics/PKLogo.png")}
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
    marginTop: 100,
    width: "100%", // Ensure the container takes up the full width
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  buttonContainer: {
    width: "100%", // Adjust the width percentage as needed
    height: 50, // Adjust as needed
    marginVertical: 10, // Add margin between buttons
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  buttonImage: {
    width: "100%", // Ensure the image takes up the full width of the button
    height: "100%", // Ensure the image takes up the full height of the button
  },
});

export default Join;
