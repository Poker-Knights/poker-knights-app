import React, { useEffect, useRef, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "../../../App";
import {
  createGame,
  handleHostGamePress,
  handleJoinGamePress,
  handleGameCreated,
} from "../../utils/Home";
import { styles } from "../../styles/HomeScreenStyles";
import {
  StatusBar,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  LogBox,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import io, { Socket } from "socket.io-client";
import { SERVER_URL } from "../../utils/socket";

type Props = {
  navigation: StackNavigationProp<StackParamList, "Join">;
};

import { Game, Player } from "../../types/Game";
//import { initializePlayers } from "../../utils/Game";

const Home = ({ navigation }: Props) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Set this to false to hide the navigation bar
    });
  }, [navigation]);

  const [username, setUsername] = useState("");
  const [gameId, setGameId] = useState("");
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [game, setGame] = useState<Game | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // useEffect is a hook that runs after the first render of the component
  // It is used to perform side effects like data fetching, subscriptions, or manual DOM manipulations
  // It runs after the render has been committed to the screen
  // It is safe to perform side effects in this function
  // Allows re renders of the component to be skipped if the props or state haven't changed
  // such as when the user is typing in the input field, the component doesn't need to re render

  useEffect(() => {
    socketRef.current = io(SERVER_URL, { transports: ["websocket"] });

    // Use the imported helper function, passing necessary dependencies
    const gameCreatedHandler = handleGameCreated(
      setGame,
      navigation,
      socketRef
    );

    if (socketRef.current) {
      socketRef.current.on("gameCreated", gameCreatedHandler);
    }

    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off("gameCreated", gameCreatedHandler);
        socketRef.current.disconnect();
      }
    };
  }, [navigation]);

  // Event emitters & helper functions for buttons
  const onCreateGame = () => createGame(username, socketRef, setGameId);
  const onHostGamePress = () => handleHostGamePress(username, onCreateGame);
  const onJoinGamePress = () => handleJoinGamePress(username, navigation);

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
      
      <View style={styles.usernameContainer}>
        <TextInput
          style={styles.usernameInput}
          textAlign={"center"}
          onChangeText={setUsername}
          value={username}
          placeholder="Username"
          placeholderTextColor="#a9a9a9" // Placeholder text color
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={onHostGamePress}
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
          onPress={onJoinGamePress}
          activeOpacity={0.7} // Reduce the opacity on press for visual feedback
        >
          <Image
            source={require("../../Graphics/JoinGameButton.png")}
            style={styles.buttonImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;
function setGameId(arg0: string) {
  throw new Error("Function not implemented.");
}
