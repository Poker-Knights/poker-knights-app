import React, { useState, useEffect, useRef } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "../../../App";

import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ImageBackground,
} from "react-native";

import { formatCurrency } from "../../utils/Money";
import {
  handleCallPress,
  handleCheckPress,
  handleFoldPress,
  handleRaisePress,
  handleAllInPress,
  handleExit,
  handleExitConfirmPress,
} from "../../utils/Game";

import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import io, { Socket } from 'socket.io-client';
import {SERVER_URL} from '../../utils/socket';

const cardBackgroundImage = require("../../Graphics/poker_background.png");

const userIcon = require("../../Graphics/userIcon.png");

const defaultAvatar = require("../../Graphics/userIcon.png"); // Relative path from the current file to the image

type GameScreenRouteProp = RouteProp<StackParamList, "Game">;


type Props = {
  navigation: StackNavigationProp<StackParamList, "Game">;
  route: GameScreenRouteProp;
};

const GameScreen = ({ navigation, route }: Props) => {
  const [pot, setPot] = useState(100); // Initialize pot state with a default value
  const [currentBet, setCurrentBet] = useState(0); // Initialize current bet state with a default value
  const { Game } = route.params;
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Set this to false to hide the navigation bar
    });
  }, [navigation]);

  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    socketRef.current = io(SERVER_URL, { transports: ['websocket'] });

    // Use the imported helper function, passing necessary dependencies
    const exitGameHandler = handleExit(navigation, socketRef, Game.id);

    if (socketRef.current) {
      socketRef.current.on('gameExited', exitGameHandler);
    }

    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off('gameExited', exitGameHandler);
        socketRef.current.disconnect();
        navigation.navigate("Home");
      }
    };
  }, [navigation, socketRef])

  // Bring user to exit confirmation modal
  const handleExitPress = () => {
    console.log("Exit button was pressed");
    setMenuVisible(true);
  };

  const onExitConfirmPress = () => handleExitConfirmPress(socketRef, Game.id);

  return (
    <View style={styles.backgroundContainer}>
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={menuVisible}
          onRequestClose={() => setMenuVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Are you sure you want to exit the game?</Text>

              {/* Exit game Button */}
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  console.log('Game was attempted to be exited');
                  onExitConfirmPress();
                }}
              >
                <Text style={styles.textStyle}>Exit game</Text>
              </TouchableOpacity>

              {/* Continue game */}
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                    console.log('Game was continued');
                    setMenuVisible(false);
                }}
              >
                <Text style={styles.textStyle}>Continue game</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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

      {/* Exit Button */}
      <TouchableOpacity
        style={styles.exitButton}
        onPress={handleExitPress}
      >
        {/* <Image
          source={require("../../Graphics/settingwidget.png")}
          style={styles.settingsIcon}
        /> */}
        <Text style={styles.exitText}>EXIT</Text>
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <ImageBackground
          source={cardBackgroundImage}
          style={styles.cardBackground}
          resizeMode="contain"
        ></ImageBackground>
      </View>

      <View style={styles.playersContainer}>
        {Game.players.map((player, index) => {
          // Determine the style based on player's index
          let playerStyle = styles.playerMiddle; // Default to middle player style
          if (index === 0) playerStyle = styles.playerLeft; // First player
          if (index === Game.players.length - 1)
            playerStyle = styles.playerRight; // Last player

          return (
            <View key={player.id} style={[styles.playerContainer, playerStyle]}>
              <Image
                source={{ uri: player.avatarUri }}
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

  exitButton: {
    position: "absolute",
    left: 10, // Adjust as needed
    top: 6,
    // ... Other styles for the exit button
  },

  settingsIcon: {
    marginTop: 20,
    marginLeft: 10,
    width: 30, // Adjust as needed
    height: 30, // Adjust as needed
    // ... Other styles for the settings icon
  },

  exitText: {
    fontFamily: "PixeloidMono",
    color: "#feeb00", // Gold color for the pot amount
    fontSize: 20, // Adjust the size as needed
    paddingBottom: 2,
    marginTop: 20,
    marginLeft: 10,
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
  
  /* Modal Styles */
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default GameScreen;
