import React, { useEffect, useState, useContext } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "../../../App";
import { styles } from "../../styles/LoadingScreenStyles";
import {
  Dimensions,
  ImageBackground,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { RouteProp } from "@react-navigation/native";
import io from "socket.io-client";
import { SocketContext } from "../../../App";
import { SERVER_URL } from "../../utils/socket.js";
import { Player } from "../../types/Game";
import { SafeAreaView } from "react-native-safe-area-context";

const cardBackgroundImage = require("../../Graphics/poker_background.png");

export const amntOfPlayers = 2; // sync this with number of players we want to allow to loading screen

type GameScreenRouteProp = RouteProp<StackParamList, "Loading">;

type Props = {
  navigation: StackNavigationProp<StackParamList, "Loading">;
  route: GameScreenRouteProp;
};

const Loading = ({ navigation, route }: Props) => {
  const { Game, username } = route.params;
  const [players, setPlayers] = useState<Player[]>(Game.players);
  const [updatedGame, setUpdatedGame] = useState<typeof Game>(Game);
  // State to manage the display text
  const [displayText, setDisplayText] = useState("WAITING...");
  const reservedSpace = 200;
  const screenHeight = Dimensions.get("window").height - reservedSpace;
  const playerContainerHeight = screenHeight / (players.length * 2);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Set this to false to hide the navigation bar
    });
  }, [navigation]);

  // Access the socket from the context
  const socketRef = useContext(SocketContext);

  useEffect(() => {
    if (!socketRef || !socketRef.current) return; // Early return if null

    // Join the specific game room upon component mount
    socketRef.current.emit("joinRoom", { gameId: Game.id });

    // Define the function inside useEffect to use its closure advantage
    const updatePlayersListener = (updatedGame: typeof Game) => {
      setUpdatedGame(updatedGame);
      setPlayers(updatedGame.players);
    };

    // Listen for player updates broadcast by the server
    socketRef.current.on("updatePlayers", updatePlayersListener);

    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off("updatePlayers", updatePlayersListener);
      }
    };
  }, []);  // removed navigation dependency, only occurs when component mounts and unmounts


  useEffect(() => {
    if (players.length !== amntOfPlayers) return;
  
    setDisplayText("JOINING...");
  
    if (!socketRef || !socketRef.current) return;
  
    socketRef.current.emit("startGame", updatedGame);
  
    let timer : any; // Declare timer here for broader scope
  
    const handleGameStarted = (initGame: any) => {
      // Update game state
      setUpdatedGame(initGame);
  
      // Set a delay before navigating
      timer = setTimeout(() => {
        navigation.navigate("Game", {
          Game: initGame,
          username: username,
        });
      }, 1000); // Delay of 1 second
    };
  
    // Register the event listener
    socketRef.current.once("gameStarted", handleGameStarted);
  
    // Cleanup function to remove listener and clear timeout if the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.off("gameStarted", handleGameStarted);
      }
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [players.length]);
  

  return (
    <SafeAreaView style={styles.backgroundContainer}>
      {/* Top part of the screen with title */}
      <View style={styles.topContainer}>
        <Text style={styles.header}>{displayText}</Text>
        <Text style={styles.gameIDText}>Game ID: {Game.id}</Text>
      </View>

      {players.map((player, index) => (
        <React.Fragment key={player.id}>
          <View
            style={[styles.playerContainer, { height: playerContainerHeight }]}
          >
            <Text style={styles.text}>PLAYER {index + 1}: </Text>
            <Text style={styles.playertext}>{player.name}</Text>
          </View>

          <View style={styles.midContainer}>
            <Image
              source={{ uri: player.avatarUri }}
              style={styles.avatar}
              resizeMode="contain"
            />
          </View>
        </React.Fragment>
      ))}

      {/* Bottom of Screen with poker chip background */}
      <View style={styles.bottomContainer}>
        <ImageBackground
          source={cardBackgroundImage}
          style={styles.cardBackground}
          resizeMode="contain"
        ></ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default Loading;