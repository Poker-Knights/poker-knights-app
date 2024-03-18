import React, { useEffect, useRef, useState } from "react";
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

  const [actionButtonsEnabled, setActionButtonsEnabled] = useState({ raise: true, call: true, fold: true, check: true, allIn: true });


  const socketRef = useRef<Socket | null>(null);
  
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Set this to false to hide the navigation bar
    });
  }, [navigation]);
  

   // There needs to be a function to evaluate which buttons you can and cannot press
  function determineAvailableActions(game: typeof Game): { raise: boolean; call: boolean; fold: boolean; check: boolean, allIn: boolean} {
    const currentPlayer = game.players[game.currentPlayer - 1];
    
    // Default actions
    let actions = { raise: true, call: true, fold: false, check: true, allIn: false};
  
    if (!currentPlayer.fold && !currentPlayer.allInFg) {
      
      //const isFirstPlayer = game.currentPlayer === (game.players.findIndex((p: { isBigBlind: boolean; }) => p.isBigBlind) + 1) % game.playerCount;     
      // -- RAISE LOGIC --
      // you cannot raise if your last bet is a not -1, you only have the option to raise if it is -1 and if you  have enough money to bet
      if (currentPlayer.lastBet === -1) {
        actions.raise = true;
      }

      else
      {
        actions.raise = false;
      }

      // -- CALL LOGIC --
      // you cannot call if the current bet is equal to the last bet
      if (game.currentBet === currentPlayer.lastBet) {
        actions.call = false;
      }

      // You can call if the current bet is greater than the last bet
      if (game.currentBet > currentPlayer.lastBet) {
        actions.call = true;
      }


      // --CHECK LOGIC--
      // you can only check if the current bet is equal to the last bet or if current bet is 0
      if (game.currentBet === currentPlayer.lastBet || game.currentBet === 0) {
        actions.check = true;
      }

      // you cannot check if the current bet is greater than the last bet
      if (game.currentBet > currentPlayer.lastBet) {
        actions.check = false;
      }

      // If you do not have enough money, you can only fold or go all in
      if (currentPlayer.money < game.currentBet) {
        actions.call = false;
        actions.raise = false;
        actions.check = false;
        actions.fold = true;
        actions.allIn = true;
      }
    }

    return actions;
  }

  // When compoment mounts, connect to the server, determine available actions
  useEffect(() => {
    socketRef.current = io(SERVER_URL, { transports: ["websocket"] });

    if (socketRef.current) 
    {

      
      
      // emit initialize players event
      socketRef.current.emit("initializePlayers", Game.id);
      

      // listen for playersForGameInitialized event
      socketRef.current.on("playersForGameInitialized", (data:any) => {
        let initGame = data.gameState;
        // update game state
        console.log(initGame.players[initGame.currentPlayer - 1].name + " has the current turn. With money: " + initGame.players[initGame.currentPlayer - 1].money + " and last bet: " + initGame.players[initGame.currentPlayer - 1].lastBet);
        setGame(initGame);
        
        // turn off the event listener
        if (socketRef.current)
        {
          socketRef.current.off("playersForGameInitialized");
        }
    
      });


      let actionButtons = determineAvailableActions(theGame);
      setActionButtonsEnabled(actionButtons);
      
    }

    return () => {
      // turn off playersForGameInitialized
      if (socketRef.current) {
        socketRef.current.off("playersForGameInitialized");
      }} 

    // call available actions function, return and set state


  }, [navigation]);

  // any changes to theGame will trigger this useEffect, re render game screen
  useEffect(() => {
    let actionButtons = determineAvailableActions(theGame);
    setActionButtonsEnabled(actionButtons);

  }, [theGame]);
  
  const handleSettingsPress = () => {
    // Implement what happens when the user presses the join button
    console.log("Settings"); // For now, we'll just log the game ID
    setMenuVisible(true);
    navigation.navigate("Home");

    // add pop menu if sure user wants to disconnect

    // handle disconnecion logic
  };

  // Re evaluate logic for indexing of current player

  // Function to handle when buttons are pressed  // export this to utils file for game
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
        if (curRaiseVal === 0) 
        {
          curRaiseVal = theGame.currentBet;
          setCallRaiseText("CALL: ");
        } 
        else if (curRaiseVal < theGame.players[theGame.currentPlayer - 1].money - 10) 
        {
          curRaiseVal += 10;
          if (curRaiseVal > theGame.currentBet) 
            setCallRaiseText("RAISE: ");
        } 
        
        else {
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
        theGame.players[(theGame.currentPlayer + 1) % theGame.playerCount].money >=
        curRaiseVal + 10
      ) {
        curRaiseVal = theGame.currentBet + 10;
      } else {
        curRaiseVal =
          theGame.players[(theGame.currentPlayer + 1) % theGame.playerCount].money;
      }
    }

    //Update Values
    setCurRaiseVal(curRaiseVal);

    // Update these values on server side
    setPot(theGame.potSize);
    setCurrentBet(theGame.currentBet);

    // Send updated game object back to server if button was pressed
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
          POT:{formatCurrency(theGame.potSize)}
        </Text>
        <Text style={GameScreenStyles.currentBetText}>
          Current Bet: {formatCurrency(theGame.currentBet)}
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
                {formatCurrency(theGame.players[theGame.currentPlayer - 1].money)}
              </Text>
              {/*player.currentTurn && <View style={GameScreenStyles.turnIndicator} />*/}
            </View>
          );
        })}
      </View>


      
      <View style={GameScreenStyles.actionButtonsContainer}>
      {/* Container for the Raise/Call/Check functionality */}
      <View style={GameScreenStyles.topButtonsContainer}>
        {/* Adjusting for dynamic Raise/Call/Check text with conditional color */}
        <View style={GameScreenStyles.raiseButtonContainer}>
          <TouchableOpacity
            onPress={() => handleButtonPress(curRaiseVal > theGame.currentBet ? "Raise" : curRaiseVal === 0 ? "Check" : "Call")}
            disabled={!actionButtonsEnabled.raise && !actionButtonsEnabled.call && !actionButtonsEnabled.check}
          >
            <Text style={[GameScreenStyles.raiseValueText,
              (!actionButtonsEnabled.raise && !actionButtonsEnabled.call && !actionButtonsEnabled.check) ? { color: 'darkgrey' } : { color: 'yellow' }
            ]}>
              {curRaiseVal > theGame.currentBet ? "RAISE" : curRaiseVal === 0 ? "CHECK" : "CALL"}: {formatCurrency(curRaiseVal)}
            </Text>
          </TouchableOpacity>

          {/* Increment and decrement buttons for raise value, with conditional color for the text */}
          <TouchableOpacity
            onPress={() => handleButtonPress("decrementRaise")}
            disabled={!actionButtonsEnabled.raise && !actionButtonsEnabled.call}
          >
            <Text style={[GameScreenStyles.raiseValueText,
              (!actionButtonsEnabled.raise && !actionButtonsEnabled.call) ? { color: 'darkgrey' } : { color: 'yellow' }
            ]}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleButtonPress("incrementRaise")}
            disabled={!actionButtonsEnabled.raise && !actionButtonsEnabled.call}
          >
            <Text style={[GameScreenStyles.raiseValueText,
              (!actionButtonsEnabled.raise && !actionButtonsEnabled.call) ? { color: 'darkgrey' } : { color: 'yellow' }
            ]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Container for All-in and Fold buttons */}
      <View style={GameScreenStyles.bottomButtonsContainer}>
        {/* ALL-IN Button */}
        <View style={GameScreenStyles.allInButtonContainer}>
          <TouchableOpacity
            onPress={() => handleButtonPress("All-in")}
            disabled={!actionButtonsEnabled.allIn}
          >
            <Text style={[GameScreenStyles.allInButtonText,
              (!actionButtonsEnabled.allIn) ? { color: 'darkgrey' } : { color: 'yellow' }
            ]}>
              ALL-IN
            </Text>
          </TouchableOpacity>
        </View>

        {/* Fold Button */}
        <View style={GameScreenStyles.foldButtonContainer}>
          <TouchableOpacity
            onPress={() => handleButtonPress("Fold")}
            disabled={!actionButtonsEnabled.fold}
          >
            <Text style={[GameScreenStyles.foldButtonText,
              (!actionButtonsEnabled.fold) ? { color: 'darkgrey' } : { color: 'yellow' }
            ]}>
              FOLD
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
  );
};

export default GameScreen;
