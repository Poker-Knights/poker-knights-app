import React, { useState, useEffect, useRef, useContext } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "../../../App";
import { GameScreenStyles } from "../../styles/GameScreenStyles";
import { cardImages, cardPaths } from "../../utils/Cards";

import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ImageBackground,
  Button,
} from "react-native";

import { formatCurrency } from "../../utils/Money";
import { handleExit, handleExitConfirmPress } from "../../utils/Game";

import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import io, { Socket } from "socket.io-client";
import { SocketContext } from "../../../App";
import { SERVER_URL } from "../../utils/socket";
import { Player } from "../../types/Game";

const cardBackgroundImage = require("../../Graphics/poker_background.png");
const loseGIF = require("../../Graphics/lose.gif");
const winGIF = require("../../Graphics/win.gif");

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

  let [currentBet, setCurrentBet] = useState(theGame.currentBet); // Track Current Bet
  let [curRaiseVal, setCurRaiseVal] = useState(theGame.currentBet); //Track Raise Value

  const [losePopupVisible, setLosePopupVisible] = useState<boolean>(false);
  const [winPopupVisible, setWinPopupVisible] = useState<boolean>(false);

  // grab player data of the client side user, the one with the username that was routed from previous screen

  // set the initial state as the player object with the username that was passed in
  // search for the username in the player array and set the player object to that
  let [thePlayer, setPlayer] = useState<Player>(
    theGame.players.find((p) => p.name === theUsername)!
  );

  let [playerIndex, setPlayerIndex] = useState<number>(0); // Initialize player index state with a default value
  // Set cards
  let [riverCards, setRiverCards] = useState<string[]>(theGame.riverCards); // Initialize river cards state with cards face down
  let [playerCards, setPlayerCards] = useState<string[]>(["back", "back"]); // Initialize player cards state with cards face down

  let [actionButtonsEnabled, setActionButtonsEnabled] = useState({
    betOption: false,
    fold: false,
    allIn: false,
  });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Set this to false to hide the navigation bar
    });
  }, [navigation]);

  // There needs to be a function to evaluate which buttons you can and cannot press
  function determineAvailableActions(game: typeof Game): {
    betOption: boolean;
    fold: boolean;
    allIn: boolean;
  } {
    // Default actions
    let actions = {
      betOption: false,
      fold: false,
      allIn: false,
    };

    if (!thePlayer.foldFG && !thePlayer.allInFg) {
      console.log("Reached inside fold flag and all in flag iff");
      // if its not your turn, you cannot do anything
      if (thePlayer.currentTurn === false) {
        actions.betOption = false;
        actions.allIn = false;
        actions.fold = false;
      } else if (thePlayer.currentTurn === true) {
        actions.betOption = true;
        actions.fold = true;
        actions.allIn = true;
      }
    }

    return actions;
  }

  // Access the socket from the context
  const socketRef = useContext(SocketContext);

  // When compoment mounts, connect to the server, determine available actions
  useEffect(() => {
    console.log(
      "This use effect is listening for updates once the comp. mounts"
    );

    let playerIndex = theGame.players.findIndex(
      (p: { name: string }) => p.name === theUsername
    );

    setPlayerIndex(playerIndex);

    //setCurrentBet(theGame.currentBet);
    //setCurRaiseVal(theGame.currentBet);

    setRiverCards(theGame.riverCards);
    //setPot(theGame.potSize);

    let actionButtons = determineAvailableActions(theGame);
    setActionButtonsEnabled(actionButtons);

    if (!socketRef) return; // Early return if null

    if (socketRef.current) {
      socketRef.current.on("updatePlayerCards", (data: any) => {
        // this needs to be updated so that it can handle individual players
        let updatedPlayerCards = data.playerCards[playerIndex];
        // update player cards
        setPlayerCards(updatedPlayerCards);
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

  useEffect(() => {
    console.log(" A player just pressed a button ");

    if (!socketRef || !socketRef.current) return; // Early return if null

    // Listen for buttonPressed event
    socketRef.current.on("handleButtonPressed", (data: typeof Game) => {
      console.log("Heard Event");

      let updatedGame: typeof Game = data;
      setGame(updatedGame);

      let actionButtons = determineAvailableActions(updatedGame);
      setActionButtonsEnabled(actionButtons);

      setPot(updatedGame.potSize);
      setCurrentBet(updatedGame.currentBet);
      setCurRaiseVal(updatedGame.currentBet);

      let updatedPlayer: Player = updatedGame.players.find(
        (p) => p.name === theUsername
      )!;
      setPlayer(updatedPlayer);
    });
  }, [theGame.currentPlayer]);

  // Bring user to exit confirmation modal
  const handleExitPress = () => {
    console.log("Exit button was pressed");
    setMenuVisible(true);
  };

  const handleLoseTestPress = () => {
    console.log("Lose button was pressed");
    setLosePopupVisible(true);
  };

  const handleWinTestPress = () => {
    console.log("Win button was pressed");
    setWinPopupVisible(true);
  };

  const onExitConfirmPress = () => {
    if (!socketRef) {
      return;
    }
    handleExitConfirmPress(socketRef, Game.id);
  };

  // Function to handle when buttons are pressed  // export this to utils file for game

  // Also will need to handle splitting the pot logic, possibly mapping a player to their own pots
  const handleButtonPress = (buttonPressed: string) => {
    if (!socketRef) return; // Early return if null

    // Switch to handle the button pressed
    // if the button is pressed, disable the button afterwards until its their turn again

    // Current Player
    let curPlayer = theGame.players[theGame.currentPlayer - 1];

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
        socketRef.current?.emit(
          "buttonPressed",
          theGame,
          theGame.id,
          "call",
          curRaiseVal
        );
        break;

      case "FOLD":
        socketRef.current?.emit(
          "buttonPressed",
          theGame,
          theGame.id,
          "fold",
          curRaiseVal
        );
        break;

      case "CHECK":
        socketRef.current?.emit(
          "buttonPressed",
          theGame,
          theGame.id,
          "check",
          curRaiseVal
        );
        break;

      case "RAISE":
        socketRef.current?.emit(
          "buttonPressed",
          theGame,
          theGame.id,
          "raise",
          curRaiseVal
        );
        break;

      case "ALL-IN":
        socketRef.current?.emit(
          "buttonPressed",
          theGame,
          theGame.id,
          "all-in",
          curRaiseVal
        );
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
      socketRef.current.emit("playerTurnComplete", theGame, theGame.id);
    }
  };

  return (
    // Things to update on UI (not in any particular order)
    // 3. Big blind & little blind indicator
    // 4. Indicate if the Player Folded
    // 5. If the player left the game or is eliminated (gray out the player prpfle picture)

    <View style={GameScreenStyles.backgroundContainer}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={GameScreenStyles.centeredView}>
          <View style={GameScreenStyles.exitModalPopupView}>
            <Text style={GameScreenStyles.modalText}>
              Are you sure you want to exit the game?
            </Text>

            {/* Exit game Button */}
            <TouchableOpacity
              style={GameScreenStyles.exitGameModalButton}
              onPress={() => {
                console.log("Game was attempted to be exited");
                onExitConfirmPress();
              }}
            >
              <Text style={GameScreenStyles.textStyle}>EXIT GAME</Text>
            </TouchableOpacity>

            {/* Continue game */}
            <TouchableOpacity
              style={GameScreenStyles.exitGameModalButton}
              onPress={() => {
                console.log("Game was continued");
                setMenuVisible(false);
              }}
            >
              <Text style={GameScreenStyles.textStyle}>CONTINUE GAME</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Win pop-up modal */}
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={winPopupVisible}
          onRequestClose={() => setWinPopupVisible(false)}
        >
          <View style={GameScreenStyles.centeredView}>
            <View style={GameScreenStyles.winModalPopupView}>
              <Image
                source={winGIF}
                style={GameScreenStyles.gif}
                resizeMode="contain"
              />
              <Text style={GameScreenStyles.modalText}>Woohoo! You won!</Text>

              {/* Exit game Button */}
              <TouchableOpacity
                style={GameScreenStyles.exitGameModalButton}
                onPress={() => {
                  console.log("Game was attempted to be exited");
                  onExitConfirmPress();
                }}
              >
                <Text style={GameScreenStyles.textStyle}>EXIT GAME</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {/* Lost pop-up modal */}
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={losePopupVisible}
          onRequestClose={() => setLosePopupVisible(false)}
        >
          <View style={GameScreenStyles.centeredView}>
            <View style={GameScreenStyles.loseModalPopupView}>
              <Image
                source={loseGIF}
                style={GameScreenStyles.gif}
                resizeMode="contain"
              />
              <Text style={GameScreenStyles.modalText}>
                Womp womp. You lost! Better luck next time!
              </Text>

              {/* Exit game Button */}
              <TouchableOpacity
                style={GameScreenStyles.exitGameModalButton}
                onPress={() => {
                  console.log("Game was attempted to be exited");
                  onExitConfirmPress();
                }}
              >
                <Text style={GameScreenStyles.textStyle}>EXIT GAME</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {/* Exit Button */}
      <TouchableOpacity
        style={GameScreenStyles.exitButton}
        onPress={handleExitPress}
      >
        <Text style={GameScreenStyles.exitText}>EXIT</Text>
      </TouchableOpacity>

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

      {/* Restructure screen so only other players avatars get displayed here*/}
      <View style={GameScreenStyles.playersContainer}>
        {Game.players
          .filter((player) => player.name !== thePlayer.name) // Filter out the main player
          .map((player, index, filteredArray) => {
            // Use filtered array for mapping
            // Determine the style based on player's index in the filtered array
            let playerStyle = GameScreenStyles.playerMiddle; // Default to middle player style
            if (index === 0) playerStyle = GameScreenStyles.playerLeft; // First player
            if (index === filteredArray.length - 1)
              playerStyle = GameScreenStyles.playerRight; // Last player

            // Add a yellow ring around the avatar if it's the player's turn
            const avatarStyle = player.currentTurn
              ? GameScreenStyles.activeTurnAvatar
              : GameScreenStyles.avatar;
            return (
              <View
                key={player.id}
                style={[GameScreenStyles.playerContainer, playerStyle]}
              >
                <Image
                  source={{ uri: player.avatarUri }}
                  style={avatarStyle}
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
              </View>
            );
          })}
      </View>

      <View style={GameScreenStyles.riverCardContainer}>
        <Image source={cardImages[riverCards[0]]} />
        <Image source={cardImages[riverCards[1]]} />
        <Image source={cardImages[riverCards[2]]} />
        <Image source={cardImages[riverCards[3]]} />
        <Image source={cardImages[riverCards[4]]} />
      </View>

      <View style={GameScreenStyles.handCardContainer}>
        <Image source={cardImages[playerCards[0]]} />
        <Image source={cardImages[playerCards[1]]} />
      </View>

      <View style={GameScreenStyles.parentToChipCountAndButtons}>
        <View style={GameScreenStyles.clientChipCountContainer}>
          <Text style={GameScreenStyles.clientChipCountText}>
            {!thePlayer.foldFG
              ? "CHIPS:$".concat(String(thePlayer.money))
              : "FOLDED"}
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
                {thePlayer.lastBet !== -1
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

      <View style={GameScreenStyles.bottomContainer}>
        <ImageBackground
          source={cardBackgroundImage}
          style={GameScreenStyles.cardBackground}
          resizeMode="contain"
        ></ImageBackground>
      </View>
    </View>
  );
};

export default GameScreen;
