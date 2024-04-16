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
  let [triggeredButton, setTriggeredButton] = useState<string>(""); // Track Button Pressed

  const [losePopupVisible, setLosePopupVisible] = useState<boolean>(false);
  const [winPopupVisible, setWinPopupVisible] = useState<boolean>(false);

  // grab player data of the client side user, the one with the username that was routed from previous screen

  // set the initial state as the player object with the username that was passed in
  // search for the username in the player array and set the player object to that
  let [thePlayer, setPlayer] = useState<Player>(
    theGame.players.find((p) => p.name === theUsername)!
  );

  let [theCurrentPlayer, setCurrentPlayer] = useState<Player>(
    theGame.players[theGame.currentPlayer - 1]
  ); // Initialize current player state with the first player in the game object

  let [playerIndex, setPlayerIndex] = useState<number>(0); // Initialize player index state with a default value
  // Set cards
  let [riverCards, setRiverCards] = useState<string[]>(theGame.riverCards); // Initialize river cards state with cards face down
  let [playerCards, setPlayerCards] = useState<string[]>(thePlayer.playerCards); // Initialize player cards state with cards face down

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
  function determineAvailableActions(
    game: typeof Game,
    player: Player
  ): {
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

    // display whose turn it is
    console.log("Player: ", player.name + "Current Turn " + player.currentTurn);
    console.log("Current Player: ", game.currentPlayer);

    if (!player.foldFG && !player.allInFg) {
      // if its not your turn, you cannot do anything
      if (player.currentTurn === false) {
        actions.betOption = false;
        actions.allIn = false;
        actions.fold = false;
      } else if (player.currentTurn === true) {
        actions.betOption = true;
        actions.fold = true;
        if (player.lastBet !== 0) {
          actions.allIn = false;
        } else {
          actions.allIn = true;
        }
      }
    }

    return actions;
  }

  const handleTriggeredButton = (action: string) => {
    handleButtonPress(action);
    setTriggeredButton(action);
  };

  // Access the socket from the context
  const socketRef = useContext(SocketContext);

  // When compoment mounts, connect to the server, determine available actions
  useEffect(() => {
    let playerIndex = theGame.players.findIndex(
      (p: { name: string }) => p.name === theUsername
    );

    setPlayerIndex(playerIndex);
    setCurrentPlayer(theGame.players[theGame.currentPlayer - 1]);

    setCurrentBet(theGame.currentBet);
    setCurRaiseVal(theGame.currentBet);

    setRiverCards(theGame.riverCards);
    setPot(theGame.potSize);

    let actionButtons = determineAvailableActions(theGame, thePlayer);
    setActionButtonsEnabled(actionButtons);

    if (!socketRef) return; // Early return if null

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
    if (!socketRef || !socketRef.current) return; // Early return if null

    // Listen for buttonPressed event
    socketRef.current.on("handledButtonPressed", (data: typeof Game) => {
      let updatedGame: typeof Game = data;
      setGame(updatedGame);
      setRiverCards(updatedGame.riverCards);

      let updatedPlayer: Player = updatedGame.players.find(
        (p) => p.name === theUsername
      )!;
      setPlayer(updatedPlayer);
      setPlayerCards(updatedPlayer.playerCards);

      let actionButtons = determineAvailableActions(updatedGame, updatedPlayer);
      setActionButtonsEnabled(actionButtons);

      setPot(updatedGame.potSize);
      setCurrentBet(updatedGame.currentBet);
      setCurRaiseVal(updatedGame.currentBet);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("handledButtonPressed");
      }
    };
  }, [triggeredButton]);

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
      } else if (curRaiseVal >= curPlayer.money) {
        buttonPressed = "ALL-IN";
      } else if (curRaiseVal === theGame.currentBet) {
        buttonPressed = "CALL";
      } else if (curRaiseVal > theGame.currentBet) {
        buttonPressed = "RAISE";
      }
    }

    switch (buttonPressed) {
      case "CALL":
        socketRef.current?.emit("buttonPressed", {
          game: theGame,
          gameID: theGame.id,
          buttonPressed: "call",
          betValue: curRaiseVal,
        });
        break;

      case "FOLD":
        socketRef.current?.emit("buttonPressed", {
          game: theGame,
          gameID: theGame.id,
          buttonPressed: "fold",
          betValue: curRaiseVal,
        });
        break;

      case "CHECK":
        socketRef.current?.emit("buttonPressed", {
          game: theGame,
          gameID: theGame.id,
          buttonPressed: "check",
          betValue: curRaiseVal,
        });
        break;

      case "RAISE":
        socketRef.current?.emit("buttonPressed", {
          game: theGame,
          gameID: theGame.id,
          buttonPressed: "raise",
          betValue: curRaiseVal,
        });
        break;

      case "ALL-IN":
        socketRef.current?.emit("buttonPressed", {
          game: theGame,
          gameID: theGame.id,
          buttonPressed: "all-in",
          betValue: curPlayer.money,
        });
        break;

      case "decrementRaise":
        // Allow Call
        if (
          curPlayer.lastBet !== 0 &&
          curPlayer.lastBet !== theGame.currentBet
        ) {
          curRaiseVal = theGame.currentBet;
        }
        // Allow Raise
        else if (curRaiseVal > 0 && curRaiseVal > theGame.currentBet)
          curRaiseVal -= 10;

        break;

      case "incrementRaise":
        // Allow Call
        if (
          curPlayer.lastBet !== 0 &&
          curPlayer.lastBet !== theGame.currentBet
        ) {
          curRaiseVal = theGame.currentBet;
          // Allow Raise
        } else if (curRaiseVal < curPlayer.money - 10) {
          curRaiseVal += 10;
          // Theyre all in
        } else {
          curRaiseVal = theGame.players[theGame.currentPlayer - 1].money;
        }
        break;
    }

    setCurRaiseVal(curRaiseVal);

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
        {theGame.players
          .filter((player) => player.name !== thePlayer.name) // Filter out the main player
          .map((player, index, filteredArray) => {
            // Use filtered array for mapping
            // Determine the style based on player's index in the filtered array
            let playerStyle = GameScreenStyles.playerMiddle; // Default to middle player style
            if (index === 0) playerStyle = GameScreenStyles.playerLeft; // First player
            if (index === filteredArray.length - 1)
              playerStyle = GameScreenStyles.playerRight; // Last player

            // Add a yellow ring around the avatar if it's the player's turn but if they folded then lower the opacity of the avatar
            let avatarStyle = GameScreenStyles.avatar;
            if (player.currentTurn) {
              avatarStyle = GameScreenStyles.activeTurnAvatar;
            }
            if (player.foldFG) {
              avatarStyle = GameScreenStyles.foldedAvatar;
            }

            return (
              <View
                key={player.id}
                style={[GameScreenStyles.playerContainer, playerStyle]}
              >

                {/* Conditionally render little blind or big blind icon next to avatar */}
                {player.isLittleBlind && (
                  <Image
                  source={{ uri: "https://i.imgur.com/RwOJWuJ.png"}} // Update path to your little blind icon
                  style={GameScreenStyles.blindIcon} // Define a style for positioning and sizing the icon
                  />
                )}
                {player.isBigBlind && (
                  <Image
                  source={{ uri: "https://i.imgur.com/fKpdah1.png" }} // Update path to your big blind icon
                  style={GameScreenStyles.blindIcon} // Define a style for positioning and sizing the icon
                  />
                )}
                
                <Image
                  source={{ uri: player.avatarUri }}
                  style={avatarStyle}
                  resizeMode="contain"
                />

                <Text style={GameScreenStyles.playerName}>{player.name}</Text>
                {/* if a player folded make the text 'FOLDED" instead of their money */}
                <Text style={GameScreenStyles.playerMoney}>
                  {!player.foldFG ? formatCurrency(player.money) : "FOLDED"}
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
              onPress={() => handleTriggeredButton("ALL-IN")}
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
              onPress={() => handleTriggeredButton("FOLD")}
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
            <TouchableOpacity
              onPress={() => handleTriggeredButton("BET")}
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
                {
                  // Check if the player has made a  bet (called or raised).
                  thePlayer.lastBet !== 0
                    ? // If so, check if the current bet is 0.
                      theGame.currentBet === 0
                      ? "CHECK" // If the current bet is 0, then display "CHECK".
                      : "CALL" // If the current bet is not 0, then display "CALL".
                    : // If the player hasn't made a last bet, check if the current raise value is >= the player's money.
                    curRaiseVal >= thePlayer.money
                    ? "ALL-IN" // If the raise value is greater or equal to the player's money, display "ALL-IN".
                    : // If not, check if the current raise value is > the current bet.
                    curRaiseVal > theGame.currentBet
                    ? "RAISE" // If the raise value is greater, then display "RAISE".
                    : // If not, check if the current raise value is 0.
                    curRaiseVal === 0
                    ? "CHECK" // If it is 0, then display "CHECK".
                    : "CALL" // If it is not 0, then display "CALL".
                }
              </Text>
            </TouchableOpacity>

            {/* Decrement button for raise value */}
            <TouchableOpacity
              onPress={() => handleButtonPress("decrementRaise")}
              // should be disabled if the player decrements below the current bet
              disabled={
                !actionButtonsEnabled.betOption ||
                curRaiseVal < theGame.currentBet
              }
            >
              <Text
                style={[
                  GameScreenStyles.raiseCallValueText,
                  !actionButtonsEnabled.betOption ||
                  curRaiseVal < theGame.currentBet
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
              disabled={
                !actionButtonsEnabled.betOption || curRaiseVal > thePlayer.money
              }
            >
              <Text
                style={[
                  GameScreenStyles.raiseCallValueText,
                  !actionButtonsEnabled.betOption ||
                  curRaiseVal > thePlayer.money
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