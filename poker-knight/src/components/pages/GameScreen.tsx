import React, { useState, useEffect, useRef } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "../../../App";
import { GameScreenStyles } from "../../styles/GameScreenStyles";

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
import io, { Socket } from "socket.io-client";
import { SERVER_URL } from "../../utils/socket";

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
  const [theGame, setGame] = useState(Game); // this is your client side representation of game object
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  let [curRaiseVal, setCurRaiseVal] = useState(10); //Track Raise Value
  let [callRaiseText, setCallRaiseText] = useState("CALL:"); //Track Raise Value

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Set this to false to hide the navigation bar
    });
  }, [navigation]);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SERVER_URL, { transports: ["websocket"] });

    // Use the imported helper function, passing necessary dependencies
    const exitGameHandler = handleExit(navigation, socketRef, Game.id);

    if (socketRef.current) {
      socketRef.current.on("gameExited", exitGameHandler);
    }

    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off("gameExited", exitGameHandler);
        socketRef.current.disconnect();
        navigation.navigate("Home");
      }
    };
  }, [navigation, socketRef]);

  // Bring user to exit confirmation modal
  const handleExitPress = () => {
    console.log("Exit button was pressed");
    setMenuVisible(true);
  };

  const onExitConfirmPress = () => handleExitConfirmPress(socketRef, Game.id);

  // Function to handle when buttons are pressed  // export this to utils file for game
  // you have to update player last bet here as well --> Matthew
  const handleButtonPress = (buttonPressed: string) => {
    // Switch to handle the button pressed
    switch (buttonPressed) {
      case "Call":
        handleCallPress(theGame);
        break;
      case "Fold":
        handleFoldPress(theGame);
        break;
      case "Check":
        handleCheckPress(theGame);
        break;
      case "Raise":
        handleRaisePress(theGame, curRaiseVal);
        break;
      case "All-in":
        handleAllInPress(theGame);
        break;
      case "decrementRaise":
        if (curRaiseVal != 0 && curRaiseVal >= theGame.currentBet) {
          if (curRaiseVal === theGame.currentBet + 10) {
            setCallRaiseText("CALL: ");
            curRaiseVal -= 10;
          } else if (curRaiseVal === theGame.currentBet) {
            curRaiseVal = 0;
            setCallRaiseText("CHECK: ");
          } else {
            curRaiseVal -= 10;
          }
        }
        break;
      case "incrementRaise":
        if (curRaiseVal === 0) {
          curRaiseVal = theGame.currentBet;
          setCallRaiseText("CALL: ");
        } else if (
          curRaiseVal <
          theGame.players[theGame.currentPlayer - 1].money - 10
        ) {
          curRaiseVal += 10;
          if (curRaiseVal > theGame.currentBet) setCallRaiseText("RAISE: ");
        } else {
          curRaiseVal = theGame.players[theGame.currentPlayer - 1].money;
        }
        break;
    }
    // Handle Proper current raise value
    if (
      buttonPressed != "incrementRaise" &&
      buttonPressed != "decrementRaise"
    ) {
      if (
        theGame.players[(theGame.currentPlayer + 1) % theGame.playerCount]
          .money >= curRaiseVal
      ) {
        curRaiseVal = theGame.currentBet;
        setCallRaiseText("CALL");
      } else {
        curRaiseVal =
          theGame.players[(theGame.currentPlayer + 1) % theGame.playerCount]
            .money;
      }
    }

    //Update Values
    setCurRaiseVal(curRaiseVal);

    // * IMPORTANT*
    // these values need to be updated on the server side as well
    setPot(theGame.potSize);
    setCurrentBet(theGame.currentBet);
  };

  return (
    <View style={GameScreenStyles.backgroundContainer}>
      <View style={GameScreenStyles.modalExitView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={menuVisible}
          onRequestClose={() => setMenuVisible(false)}
        >
          <View style={GameScreenStyles.centeredView}>
            <View style={GameScreenStyles.modalPopupView}>
              <Text style={GameScreenStyles.modalText}>
                Are you sure you want to exit the game?
              </Text>

              {/* Exit game Button */}
              <TouchableOpacity
                style={[GameScreenStyles.button, GameScreenStyles.buttonClose]}
                onPress={() => {
                  console.log("Game was attempted to be exited");
                  onExitConfirmPress();
                }}
              >
                <Text style={GameScreenStyles.textStyle}>Exit game</Text>
              </TouchableOpacity>

              {/* Continue game */}
              <TouchableOpacity
                style={[GameScreenStyles.button, GameScreenStyles.buttonClose]}
                onPress={() => {
                  console.log("Game was continued");
                  setMenuVisible(false);
                }}
              >
                <Text style={GameScreenStyles.textStyle}>Continue game</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {/* Top part of the screen with pot and current bet */}
      <View style={GameScreenStyles.topContainer}>
        <Text style={GameScreenStyles.potText}>
          POT:{formatCurrency(theGame.potSize)}
        </Text>
        <Text style={GameScreenStyles.currentBetText}>
          Current Bet: {formatCurrency(theGame.currentBet)}
        </Text>

        {/* White line */}
        <View style={GameScreenStyles.whiteLine} />
      </View>

      {/* Exit Button */}
      <TouchableOpacity
        style={GameScreenStyles.exitButton}
        onPress={handleExitPress}
      >
        {/* <Image
          source={require("../../Graphics/settingwidget.png")}
          style={GameScreenStyles.settingsIcon}
        /> */}
        <Text style={GameScreenStyles.exitText}>EXIT</Text>
      </TouchableOpacity>

      <View style={GameScreenStyles.bottomContainer}>
        <ImageBackground
          source={cardBackgroundImage}
          style={GameScreenStyles.cardBackground}
          resizeMode="contain"
        ></ImageBackground>
      </View>

      <View style={GameScreenStyles.playersContainer}>
        {Game.players.map((player, index) => {
          // Determine the style based on player's index
          let playerStyle = GameScreenStyles.playerMiddle; // Default to middle player style
          if (index === 0) playerStyle = GameScreenStyles.playerLeft; // First player
          if (index === Game.players.length - 1)
            playerStyle = GameScreenStyles.playerRight; // Last player

          return (
            <View
              key={player.id}
              style={[GameScreenStyles.playerContainer, playerStyle]}
            >
              <Image
                source={{ uri: player.avatarUri }}
                style={GameScreenStyles.avatar}
                resizeMode="contain"
              />
              <Text style={GameScreenStyles.playerName}>{player.name}</Text>
              <Text style={GameScreenStyles.playerMoney}>
                {formatCurrency(
                  theGame.players[theGame.currentPlayer - 1].money
                )}
              </Text>
              {/*player.currentTurn && <View style={GameScreenStyles.turnIndicator} />*/}
            </View>
          );
        })}
      </View>

      <View style={GameScreenStyles.actionButtonsContainer}>
        {/* Container for the Raise and All-in buttons */}
        <View style={GameScreenStyles.topButtonsContainer}>
          {/* Raise Functionality */}
          <View style={GameScreenStyles.raiseButtonContainer}>
            <TouchableOpacity onPress={() => handleButtonPress("Raise")}>
              <Text style={GameScreenStyles.raiseValueText}>
                {callRaiseText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleButtonPress("decrementRaise")}
            >
              <Text style={GameScreenStyles.raiseValueText}>-</Text>
            </TouchableOpacity>
            <Text style={GameScreenStyles.raiseValueText}>{curRaiseVal}</Text>
            <TouchableOpacity
              onPress={() => handleButtonPress("incrementRaise")}
            >
              <Text style={GameScreenStyles.raiseValueText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Container for the Call and Fold buttons */}
        <View style={GameScreenStyles.bottomButtonsContainer}>
          {/* ALL-IN Button */}
          <View style={GameScreenStyles.allInButtonContainer}>
            <TouchableOpacity onPress={() => handleButtonPress("All-in")}>
              <Text style={GameScreenStyles.allInButtonText}>ALL-IN</Text>
            </TouchableOpacity>
          </View>
          {/* Container for the Check button */}
          <View style={GameScreenStyles.checkButtonContainer}>
            <TouchableOpacity onPress={() => handleButtonPress("Check")}>
              <Text style={GameScreenStyles.checkButtonText}>CHECK</Text>
            </TouchableOpacity>
          </View>
          {/* Fold Button Container */}
          <View style={GameScreenStyles.foldButtonContainer}>
            <TouchableOpacity onPress={() => handleButtonPress("Fold")}>
              <Text style={GameScreenStyles.foldButtonText}>FOLD</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default GameScreen;
