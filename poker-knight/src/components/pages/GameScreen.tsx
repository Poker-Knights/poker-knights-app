import React, { useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "../../../App";
import { GameScreenStyles } from "../../styles/GameScreenStyles";

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
  let [curRaiseVal, setCurRaiseVal] = useState(10); //Track Raise Value

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

  // Function to handle when buttons are pressed
  const handleButtonPress = (buttonPressed: string) => {
    // Switch to handle the button pressed
    switch (buttonPressed) {
      case "Call":
        handleCallPress(Game);
        break;
      case "Fold":
        handleFoldPress(Game);
        break;
      case "Check":
        handleCheckPress(Game);
        break;
      case "Raise":
        handleRaisePress(Game, curRaiseVal);
        break;
      case "All-in":
        handleAllInPress(Game);
        break;
      case "decrementRaise":
        if (curRaiseVal != 0) curRaiseVal -= 10;
        break;
      case "incrementRaise":
        if (curRaiseVal < Game.players[Game.currentPlayer - 1].money - 10)
          curRaiseVal += 10;
        else {
          curRaiseVal = Game.players[Game.currentPlayer - 1].money;
        }
        break;
    }
    // Handle Proper current raise value
    if (
      buttonPressed != "incrementRaise" &&
      buttonPressed != "decrementRaise"
    ) {
      if (
        Game.players[(Game.currentPlayer + 1) % Game.playerCount].money >=
        curRaiseVal + 10
      ) {
        curRaiseVal = Game.currentBet + 10;
      } else {
        curRaiseVal =
          Game.players[(Game.currentPlayer + 1) % Game.playerCount].money;
      }
    }

    //Update Value
    setCurRaiseVal(curRaiseVal);
    setPot(Game.potSize);
    setCurrentBet(Game.currentBet);
  };

  return (
    <View style={GameScreenStyles.backgroundContainer}>
      <View style={GameScreenStyles.modalView}>
        <PopupMenu
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
        />
      </View>
      {/* Top part of the screen with pot and current bet */}
      <View style={GameScreenStyles.topContainer}>
        <Text style={GameScreenStyles.potText}>
          POT:{formatCurrency(Game.potSize)}
        </Text>
        <Text style={GameScreenStyles.currentBetText}>
          Current Bet: {formatCurrency(Game.currentBet)}
        </Text>

        {/* White line */}
        <View style={GameScreenStyles.whiteLine} />
      </View>

      {/* Settings Button */}
      <TouchableOpacity
        style={GameScreenStyles.settingsButton}
        onPress={handleSettingsPress}
      >
        <Image
          source={require("../../Graphics/settingwidget.png")}
          style={GameScreenStyles.settingsIcon}
        />
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
                {formatCurrency(Game.players[Game.currentPlayer - 1].money)}
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
              <Text style={GameScreenStyles.raiseValueText}>RAISE:</Text>
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

          {/* Call Button Container */}
          <View style={GameScreenStyles.callButtonContainer}>
            <TouchableOpacity onPress={() => handleButtonPress("Call")}>
              <Text style={GameScreenStyles.callButtonText}>CALL: </Text>
            </TouchableOpacity>
            <Text style={GameScreenStyles.callButtonText}>
              {Game.currentBet}
            </Text>
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
