import React, { useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "../../../App";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ImageBackground,
} from "react-native";

import { PopupMenu } from "./Settings"; // Import PopupMenu, will need to change
// import { handleSettingsPress } from "../../utils/settingsUtil";
import { formatCurrency } from "../../utils/Money";
import {
  initializePlayers,
  handleCallPress,
  handleCheckPress,
  handleFoldPress,
  handleRaisePress,
  handleAllInPress,
} from "../../utils/Game";

import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
const cardBackgroundImage = require("../../Graphics/poker_background.png");

const userIcon = require("../../Graphics/userIcon.png");
const avatarImages = {
  avatar1: require("../../Graphics/knight.png"),
  avatar2: require("../../Graphics/PKLogo.png"),
  avatar3: require("../../Graphics/backArrow.png"),
  //avatar2: require("../../Graphics/avatar2.png"),
  //avatar3:
  //avatar4

  // Add all other avatars here
};

const defaultAvatar = require("../../Graphics/userIcon.png"); // Relative path from the current file to the image

type GameScreenRouteProp = RouteProp<StackParamList, "Game">;

type Props = {
  navigation: StackNavigationProp<StackParamList, "Game">;
  route: GameScreenRouteProp;
};

const GameScreen = ({ navigation, route }: Props) => {
  const [pot, setPot] = useState(100); // Initialize pot state with a default value
  const [currentBet, setCurrentBet] = useState(0); // Initialize current bet state with a default value
  const { gameId, players } = route.params;
  const usedKeys = new Set(); // Create a set to keep track of used keys

  const [players, setPlayers] = useState(initializePlayers());
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Set this to false to hide the navigation bar
    });
  }, [navigation]);

  const handleSettingsPress = () => {
    // Implement what happens when the user presses the join button
    console.log("Settings"); // For now, we'll just log the game ID
    setMenuVisible(true);
    //navigation.navigate("Settings");
  };
  return (
    <View style={styles.backgroundContainer}>
      <View style={styles.modalView}>
        <PopupMenu
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
        />
      </View>
      {/* Top part of the screen with pot and current bet */}
      <View style={styles.topContainer}>
        <Text style={styles.potText}>POT:{formatCurrency(pot)}</Text>
        <Text style={styles.currentBetText}>
          Current Bet: {formatCurrency(currentBet)}
        </Text>

        {/* White line */}
        <View style={styles.whiteLine} />
      </View>

      {/* Settings Button */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={handleSettingsPress}
      >
        <Image
          source={require("../../Graphics/settingwidget.png")}
          style={styles.settingsIcon}
        />
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <ImageBackground
          source={cardBackgroundImage}
          style={styles.cardBackground}
          resizeMode="contain"
        ></ImageBackground>
      </View>

      <View style={styles.playersContainer}>
        {players.map((player, index) => {
          // Determine the style based on player's index
          let playerStyle = styles.playerMiddle; // Default to middle player style
          if (index === 0) playerStyle = styles.playerLeft; // First player
          if (index === players.length - 1) playerStyle = styles.playerRight; // Last player

          // Get an array of keys from avatarImages
          const keys = Object.keys(avatarImages);

          let randomKey;
          do {
            // Generate a random index based on the number of keys
            const randomIndex = Math.floor(Math.random() * keys.length);
            // Get a random key using the random index
            randomKey = keys[randomIndex];
          } while (usedKeys.has(randomKey)); // Continue if key is already used

          // Mark the selected key as used
          usedKeys.add(randomKey);
          const avatarSource = (avatarImages as any)[randomKey];
          // Save the profile pic to the player object for game state purposes
          player.avatarUri = avatarSource;

          return (
            <View key={player.id} style={[styles.playerContainer, playerStyle]}>
              <Image
                source={avatarSource}
                style={styles.avatar}
                resizeMode="contain"
              />
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerMoney}>
                {formatCurrency(player.money)}
              </Text>
              {/*player.currentTurn && <View style={styles.turnIndicator} />*/}
            </View>
          );
        })}
      </View>

      {/* Action buttons container */}
      <View style={styles.actionButtonsContainer}>
        {/* Container for the "ALL-IN" button */}
        <View style={styles.allInButtonContainer}>
          <TouchableOpacity onPress={handleAllInPress}>
            <Text style={styles.allInButtonText}>ALL-IN</Text>
          </TouchableOpacity>
        </View>

        {/* Container for the "CALL", "FOLD", "CHECK", "RAISE" buttons */}
        <View style={styles.lowerButtonsContainer}>
          <TouchableOpacity onPress={handleCallPress}>
            <Text style={styles.lowerActionButtonText}>CALL</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFoldPress}>
            <Text style={styles.lowerActionButtonText}>FOLD</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCheckPress}>
            <Text style={styles.lowerActionButtonText}>CHECK</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRaisePress}>
            <Text style={styles.lowerActionButtonText}>RAISE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: "#292626", // Correct property for background color
  },

  bottomContainer: {
    position: "absolute",
    bottom: 230,
    width: "100%",
    alignItems: "center",
    height: "60%",
  },

  cardBackground: {
    width: "98%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  settingsButton: {
    position: "absolute",
    left: 10, // Adjust as needed
    top: 6,
    // ... Other styles for the settings button
  },

  settingsIcon: {
    marginTop: 20,
    marginLeft: 10,
    width: 30, // Adjust as needed
    height: 30, // Adjust as needed
    // ... Other styles for the settings icon
  },

  topContainer: {
    backgroundColor: "#292626", // Background color as per your design
    paddingBottom: 10, // Or any other value that fits your design
    alignItems: "center",
    marginTop: 50,
  },
  potText: {
    fontFamily: "PixeloidMono",
    color: "#feeb00", // Gold color for the pot amount
    fontSize: 36, // Adjust the size as needed
    paddingBottom: 2,
  },
  currentBetText: {
    fontFamily: "PixeloidMono",
    color: "#feeb00", // Gold color for the current bet amount
    fontSize: 14, // Adjust the size as needed
  },

  whiteLine: {
    height: 2, // Height of the white line
    backgroundColor: "#FFFFFF", // White color for the line
    width: "80%", // Width of the line, adjust as needed
    marginTop: 4, // Space between the text and the line, adjust as needed
  },

  // avatar: {
  //   width: 80, // Adjust the size as needed
  //   height: 80, // Adjust the size as needed
  //   borderRadius: 40, // Half the width/height to make it a circle
  //   borderWidth: 2, // Size of border around the avatar
  //   borderColor: "#FFFFFF", // Border color, assuming white is desired
  //   backgroundColor: "#C4C4C4", // A placeholder background color in case the image fails to load
  // },

  avatar: {
    width: 80, // Adjust the size as needed
    height: 80, // Adjust the size as needed
    borderRadius: 40, // Half the width/height to make it a circle
    borderWidth: 2, // Size of border around the avatar
    borderColor: "#FFFFFF", // Border color, assuming white is desired
    backgroundColor: "#C4C4C4", // A placeholder background color in case the image fails to load
    overflow: "hidden", // Ensures that the image does not spill out of the border radius
  },

  playerName: {
    fontFamily: "PixeloidMono",
    color: "#feeb00", // Assuming a gold color for the player's name text
    fontSize: 16, // Adjust the size as needed
    marginTop: 4, // Space between the avatar and the name
  },
  playerMoney: {
    fontFamily: "PixeloidMono",
    color: "#feeb00", // Assuming white color for the player's money text
    fontSize: 14, // Adjust the size as needed
    marginTop: 2, // Space between the name and the money
  },

  playersContainer: {
    flexDirection: "row",
    justifyContent: "center", // This will distribute your player containers evenly across the top
    height: 250,
    alignItems: "flex-end",
  },

  playerContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    // If you need to space out the player containers evenly, you might consider additional layout styling here
  },

  playerLeft: {
    position: "absolute",
    left: 5, // Adjust based on your design needs
    bottom: 5, // Lower the left player to create a triangle formation
  },
  playerMiddle: {
    position: "absolute",
    bottom: 100, // Adjust based on your design needs, this should be the highest point
  },
  playerRight: {
    position: "absolute",
    right: 5, // Adjust based on your design needs
    bottom: 5, // Lower the right player to create a triangle formation
  },

  actionButtonsContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
  },
  allInButtonContainer: {
    marginBottom: 20, // Space between the "ALL-IN" button and the lower buttons
    // Other styles as needed
  },
  allInButton: {
    // Styles for the "ALL-IN" button
    // Add padding, background color, etc. as per your design
  },
  allInButtonText: {
    fontFamily: "PixeloidMono",
    color: "#feeb00", // Assuming white color for the player's money text
    fontSize: 20, // Adjust the size as needed
  },
  lowerButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    // Other styles as needed
  },

  lowerActionButtonText: {
    fontFamily: "PixeloidMono",
    color: "#feeb00", // Assuming white color for the player's money text
    fontSize: 20, // Adjust the size as needed
    bottom: 15,
    paddingTop: 10,
  },
  modalView: {
    alignItems: "center",
  },
});

export default GameScreen;
