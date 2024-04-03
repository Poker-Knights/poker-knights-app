import React, { useEffect, useState, useContext } from 'react'
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../../App';
import { styles } from '../../styles/LoadingScreenStyles';
import { Dimensions, ImageBackground, Image, StyleSheet, Text, View } from "react-native";

import { RouteProp } from "@react-navigation/native";
import io from 'socket.io-client';
import { SocketContext } from "../../../App";
import { SERVER_URL } from "../../utils/socket.js";
import { Player } from '../../types/Game';

const cardBackgroundImage = require("../../Graphics/poker_background.png");

type GameScreenRouteProp = RouteProp<StackParamList, 'Loading'>;

type Props = {
    navigation: StackNavigationProp<StackParamList,'Loading'>;
    route: GameScreenRouteProp;
}

const Loading = ({ navigation, route }: Props) => {
    const { Game, username } = route.params;
    const [players, setPlayers] = useState<Player[]>(Game.players);
    // State to manage the display text
    const [displayText, setDisplayText] = useState("LOADING...");
    const reservedSpace = 200;
    const screenHeight = Dimensions.get('window').height - reservedSpace;
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
      socketRef.current.emit('joinRoom', { gameId: Game.id });

      // Define the function inside useEffect to use its closure advantage
      const updatePlayersListener = (updatedPlayers: Player[]) => {
        setPlayers(updatedPlayers);
      };
      
      // Listen for player updates broadcast by the server
      socketRef.current.on('updatePlayers', updatePlayersListener);
      
      // Cleanup on component unmount
      return () => {
        if (socketRef.current) {
          socketRef.current.off('updatePlayers', updatePlayersListener);
        }
      };
    }, []);

    useEffect(() => {
      if (players.length === 4) {
        // Update the text right before setting the timeout
        setDisplayText("JOINING...");

        const timer = setTimeout(() => {
          navigation.navigate('Game', { username: username, Game: Game });
        }, 3000); // 3000 milliseconds = 3 seconds
    
        return () => clearTimeout(timer); // Cleanup the timer
      }
    }, [players, navigation]);
    

    return (
    <View style={styles.backgroundContainer}>
        {/* Top part of the screen with title */}
        <View style={styles.topContainer}>
            <Text style={styles.header}>{displayText}</Text>
        </View>

        {players.map((player, index) => (
          <React.Fragment key={player.id}>
            <View style={[styles.playerContainer, { height: playerContainerHeight }]}>
              <Text style={styles.text}>PLAYER {index + 1}: </Text>
              <Text style={styles.playertext}>{player.name}</Text>
            </View>

            <View style={styles.midContainer}>
              <Image
                source={{ uri: player.avatarUri }}
                style={styles.avatar}
                resizeMode="contain" />
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
    </View>
    );
};

export default Loading