import React, { useEffect, useRef, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "../../../App";
import { Game } from "../../types/Game";
import { styles } from "../../styles/JoinGameScreenStyles";
import { handleJoinPress, handleBackPress, handleGameJoined, handleGameNotFound, handleUsernameTaken } from "../../utils/Join";

import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp } from "@react-navigation/native";
//import { addPlayer } from "../../utils/Game";
import io, { Socket } from 'socket.io-client';
import {SERVER_URL} from '../../utils/socket';

type GameScreenRouteProp = RouteProp<StackParamList, "Join">;

type Props = {
  navigation: StackNavigationProp<StackParamList, "Join">;
  route: GameScreenRouteProp;
};

const Join = ({ navigation, route }: Props) => {
  const {username} = route.params;
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Set this to false to hide the navigation bar
    });
  }, [navigation]);

  const socketRef = useRef<Socket | null>(null)
  const [gameID, setGameID] = useState("");

   // Set up socket connection and event listeners
   useEffect(() => {
    socketRef.current = io(SERVER_URL, { transports: ['websocket'] });

    // Bind necessary parameters to the handlers
    const gameJoinedHandler = handleGameJoined(navigation, username);
    const gameNotFoundHandler = handleGameNotFound();
    const usernameTakenHandler = handleUsernameTaken();

    if (socketRef.current) {
      socketRef.current.on('gameJoined', gameJoinedHandler);
      socketRef.current.on('gameNotFound', gameNotFoundHandler);
      socketRef.current.on('usernameTaken', usernameTakenHandler);
    }

    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off('gameJoined', gameJoinedHandler);
        socketRef.current.off('gameNotFound', gameNotFoundHandler);
        socketRef.current.off('usernameTaken', usernameTakenHandler);
        socketRef.current.disconnect();
      }
    };
  }, [navigation, username]);


  const onJoinPress = () => handleJoinPress(socketRef, username, gameID);
  const onBackPress = () => handleBackPress(navigation);



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>READY?</Text>
        <Text style={styles.subtitle}>ENTER GAME ID </Text>
        <Text style={styles.subtitle}>BELOW! </Text>
        <Text style={styles.subtitle}> </Text>
      </View>

      {/* <View style={styles.knightContainer}>
        <Image
          source={require("../../Graphics/knight.png")}
          style={styles.knightIcon}
          resizeMode="contain" // This will make sure the entire icon is visible
        />
      </View> */}

      <View style={styles.gameIDContainer}>
        <TextInput
          style={styles.gameIDInput}
          textAlign={"center"}
          keyboardType="numeric"
          onChangeText= {setGameID}
          maxLength={6} // Placeholder
          value = {gameID} // Convert gameID to string
          placeholder="Game ID"
          placeholderTextColor="#a9a9a9" // Placeholder text color
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={onJoinPress}
          activeOpacity={0.7} // Reduce the opacity on press for visual feedback
        >
          <Image
            source={require("../../Graphics/longButton.png")}
            style={styles.buttonImage}
            resizeMode="contain"
          />
          <Text style={styles.buttonText}>Enter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.backButton}>
        <TouchableOpacity
          // style={}
          onPress={onBackPress}
          activeOpacity={0.7} // Reduce the opacity on press for visual feedback
        >
          <Image
            source={require("../../Graphics/backArrow.png")}
            style={styles.arrowImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Join;
