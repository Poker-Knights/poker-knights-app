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
  let [pot, setPot] = useState(100); // Initialize pot state with a default value
  const { Game, username } = route.params;
  const [theGame, setGame] = useState(Game); // this is your client side representation of game object
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  let [theUsername, setUsername] = useState(username); // this is your client side representation of game object
  let [currentBet, setCurrentBet] = useState(theGame.currentBet); // Initialize current bet state with a default value
  let [curRaiseVal, setCurRaiseVal] = useState(theGame.currentBet); //Track Raise Value

  // grab player data of the client side user, the one with the username that was routed from previous screen

  // set the initial state as an empty object
  let [player, setPlayer] = useState<any>({});
  let [actionButtonsEnabled, setActionButtonsEnabled] = useState({
    betOption: true,
    fold: true,
    allIn: true,
  });

  const socketRef = useRef<Socket | null>(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Set this to false to hide the navigation bar
    });
  }, [navigation]);

  // There needs to be a function to evaluate which buttons you can and cannot press [MUST BE TESTED]
  function determineAvailableActions(game: typeof Game): {
    betOption: boolean;
    fold: boolean;
    allIn: boolean;
  } {
    const currentPlayer = game.players[game.currentPlayer - 1];

    // Default actions
    let actions = {
      betOption: true,
      fold: true,
      allIn: true,
    };

    console.log(theGame.players);

    if (!currentPlayer.foldFG && !currentPlayer.allInFg) {
      // if its not your turn, you cannot do anything
      if (currentPlayer.currentTurn === false) {
      } else {
        actions.betOption = true;
        actions.fold = true;
        actions.allIn = true;
      }
    }
    return actions;
  }

  // When compoment mounts, connect to the server, determine available actions
  useEffect(() => {
    socketRef.current = io(SERVER_URL, { transports: ["websocket"] });

    if (socketRef.current) {
      // emit initialize players event
      socketRef.current.emit("initializePlayers", Game.id);

      // listen for playersForGameInitialized event
      socketRef.current.on("playersForGameInitialized", (data: any) => {
        let initGame = data.gameState;

        let newPlayer = initGame.players.find(
          (p: { name: string }) => p.name === theUsername
        );

        // update game state
        setGame(initGame);
        setPlayer(newPlayer);

        // turn off the event listener
        if (socketRef.current) {
          socketRef.current.off("playersForGameInitialized");
        }
      });

      // listen for updateGameAfterPlayerButtonPress event
      socketRef.current.on("updateGameAfterPlayerButtonPress", (data: any) => {
        let updatedGame = data.gameState;
        // update game state
        setGame(updatedGame);
      });
    }
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
  }, [navigation]);

  // Bring user to exit confirmation modal
  const handleExitPress = () => {
    console.log("Exit button was pressed");
    setMenuVisible(true);
  };

  // any changes to theGame will trigger this useEffect and update client side player state
  const isMounted = useRef(false);

  // any changes to theGame will trigger this useEffect and update client side player state
  useEffect(() => {
    // Skip the first invocation (initial render)
    if (isMounted.current) {
      // Your existing useEffect logic here, to run on updates after the initial render
      let actionButtons = determineAvailableActions(theGame);
      setActionButtonsEnabled(actionButtons);

      let newPlayer = theGame.players.find((p) => p.name === username);
      newPlayer && setPlayer(newPlayer);
    } else {
      // Mark as mounted for subsequent renders
      isMounted.current = true;
    }
  }, [theGame]);

  const onExitConfirmPress = () => handleExitConfirmPress(socketRef, Game.id);

  // Function to handle when buttons are pressed  // export this to utils file for game
  // Also will need to handle splitting the pot logic, possibly mapping a player to their own pots
  const handleButtonPress = (buttonPressed: string) => {
    // Switch to handle the button pressed
    // if the button is pressed, disable the button afterwards until its their turn again

    // Current Player
    let curPlayer = theGame.players[theGame.currentPlayer - 1];
    console.log(curPlayer);
    console.log(theGame.currentBet);

    // Determine BET case
    if (buttonPressed === "BET") {
      if (curRaiseVal === 0) {
        buttonPressed = "CHECK";
      } else if (curRaiseVal === theGame.currentBet) {
        buttonPressed = "CALL";
      } else if (curRaiseVal > theGame.currentBet) {
        buttonPressed = "RAISE";
      }
    }

    switch (buttonPressed) {
      case "CALL":
        handleCallPress(theGame);
        break;

      case "FOLD":
        handleFoldPress(theGame);
        break;

      case "CHECK":
        handleCheckPress(theGame);
        break;

      case "RAISE":
        handleRaisePress(theGame, curRaiseVal);
        break;

      case "ALL-IN":
        handleAllInPress(theGame);
        break;

      case "decrementRaise":
        if (
          curPlayer.lastBet !== -1 &&
          curPlayer.lastBet !== theGame.currentBet
        ) {
          curRaiseVal = theGame.currentBet;
        } else if (curRaiseVal > 0 && curRaiseVal > theGame.currentBet)
          curRaiseVal -= 10;
        else {
          // ADD LOGIC TO GREY OUT DECREMENT IF WE CANT GO LOWER
        }
        break;

      case "incrementRaise":
        if (
          curPlayer.lastBet !== -1 &&
          curPlayer.lastBet === theGame.currentBet
        ) {
          curRaiseVal = theGame.currentBet;
        } else if (curRaiseVal < curPlayer.money - 10) {
          curRaiseVal += 10;
        } else {
          curRaiseVal = theGame.players[theGame.currentPlayer - 1].money;
          // ADD LOGIC TO GREY OUT DECREMENT IF WE CANT GO HIGHER
        }
        break;
    }

    //Update Values
    setCurRaiseVal(curRaiseVal);

    // Update these values on server side
    setPot(theGame.potSize);
    setCurrentBet(theGame.currentBet);

    // Send updated game object back to server if button was pressed
    if (socketRef.current) {
      socketRef.current.emit(
        "updateGameAfterPlayerButtonPress",
        theGame,
        theGame.id
      );
    }
  };

  return (
    // Things to update on UI (not in any particular order)
    // 2. Player Turn Indicator
    // 3. Big blind & little blind indicator
    // 4. Indicate if the Player Folded
    // 5. If the player left the game or is eliminated (gray out the player prpfle picture)
    // 6. card display
    // 7. win screen
    // 8. losing screen
    // 9. have the UI reflected so that client side user is the main user

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
                  onExitConfirmPress();
                }}
              >
                <Text style={GameScreenStyles.textStyle}>Exit game</Text>
              </TouchableOpacity>

              {/* Continue game */}
              <TouchableOpacity
                style={[GameScreenStyles.button, GameScreenStyles.buttonClose]}
                onPress={() => {
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

      {/* Restructure screen so only other players avatars get displayed here*/}
      <View style={GameScreenStyles.playersContainer}>
        {Game.players
          .filter((player) => player.name !== theUsername) // Filter out the main player
          .map((player, index, filteredArray) => {
            // Use filtered array for mapping
            // Determine the style based on player's index in the filtered array
            let playerStyle = GameScreenStyles.playerMiddle; // Default to middle player style
            if (index === 0) playerStyle = GameScreenStyles.playerLeft; // First player
            if (index === filteredArray.length - 1)
              playerStyle = GameScreenStyles.playerRight; // Last player

            // Determine if player is big blind or little blind
            // Game.curBigBlind and Game.curLittleBlind are the indexes of the big blind and little blind players respectively
            
            // Add a yellow ring around the avatar if it's the player's turn
            const avatarStyle = player.currentTurn
            
            ? [GameScreenStyles.avatar, GameScreenStyles.activeTurnAvatar] 
            : GameScreenStyles.avatar;

            

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
                    
                {/* Conditionally render little blind or big blind icon next to avatar */}
                {/* {player.isSmallBlind && (
                  <Image
                    source={require('../../path/to/little_blind_icon.png')} // Update path to your little blind icon
                    style={GameScreenStyles.blindIcon} // Define a style for positioning and sizing the icon
                  />
                )}
                {player.isBigBlind && (
                  <Image
                    source={require('../../path/to/big_blind_icon.png')} // Update path to your big blind icon
                    style={GameScreenStyles.blindIcon} // Define a style for positioning and sizing the icon
                  />
                )} */}

                <Text style={GameScreenStyles.playerName}>{player.name}</Text>
                <Text style={GameScreenStyles.playerMoney}>
                  {formatCurrency(player.money)}
                </Text>
                {/*player.currentTurn && <View style={GameScreenStyles.turnIndicator} />*/}
              </View>
            );
          })}
      </View>

      <View style={GameScreenStyles.clientChipCountContainer}>
        <Text style={GameScreenStyles.clientChipCountText}>
          {!player.fold ? "CHIPS:$".concat(String(player.money)) : "FOLDED"}
        </Text>
      </View>
      <View style={GameScreenStyles.actionButtonsContainer}>
        {/* ALL-IN Button */}
        <View style={GameScreenStyles.allInButtonContainer}>
          <TouchableOpacity
            onPress={() => handleButtonPress("ALL-IN")}
            disabled={!actionButtonsEnabled.allIn}
          >
            <Text
              style={[
                GameScreenStyles.allInButtonText,
                !actionButtonsEnabled.allIn
                  ? { color: "darkgrey" }
                  : { color: "yellow" },
              ]}
            >
              ALL-IN
            </Text>
          </TouchableOpacity>
        </View>

        {/* Fold Button */}
        <View style={GameScreenStyles.foldButtonContainer}>
          <TouchableOpacity
            onPress={() => handleButtonPress("FOLD")}
            disabled={!actionButtonsEnabled.fold}
          >
            <Text
              style={[
                GameScreenStyles.foldButtonText,
                !actionButtonsEnabled.fold
                  ? { color: "darkgrey" }
                  : { color: "yellow" },
              ]}
            >
              FOLD
            </Text>
          </TouchableOpacity>
        </View>
        {/* Container for the Raise/Call/Check functionality */}
        <View style={GameScreenStyles.raiseCallButtonContainer}>
          {/* Label */}
          <TouchableOpacity
            onPress={() => handleButtonPress("BET")}
            disabled={!actionButtonsEnabled.betOption}
          >
            <Text
              style={[
                GameScreenStyles.raiseCallValueText,
                !actionButtonsEnabled.betOption
                  ? { color: "darkgrey" }
                  : { color: "yellow" },
              ]}
            >
              {player.lastBet !== -1
                ? theGame.currentBet === 0
                  ? "CHECK"
                  : "CALL"
                : curRaiseVal > theGame.currentBet
                ? "RAISE"
                : curRaiseVal === 0
                ? "CHECK"
                : "CALL"}
              :
            </Text>
          </TouchableOpacity>

          {/* Decrement button for raise value */}
          <TouchableOpacity
            onPress={() => handleButtonPress("decrementRaise")}
            disabled={!actionButtonsEnabled.betOption}
          >
            <Text
              style={[
                GameScreenStyles.raiseCallValueText,
                !actionButtonsEnabled.betOption
                  ? { color: "darkgrey" }
                  : { color: "yellow" },
              ]}
            >
              -
            </Text>
          </TouchableOpacity>

          {/* Current raise value */}
          <Text
            style={[
              GameScreenStyles.raiseCallValueText,
              !actionButtonsEnabled.betOption
                ? { color: "darkgrey" }
                : { color: "yellow" },
            ]}
          >
            {formatCurrency(curRaiseVal)}
          </Text>

          {/* Increment button for raise value */}
          <TouchableOpacity
            onPress={() => handleButtonPress("incrementRaise")}
            disabled={!actionButtonsEnabled.betOption}
          >
            <Text
              style={[
                GameScreenStyles.raiseCallValueText,
                !actionButtonsEnabled.betOption
                  ? { color: "darkgrey" }
                  : { color: "yellow" },
              ]}
            >
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default GameScreen;
