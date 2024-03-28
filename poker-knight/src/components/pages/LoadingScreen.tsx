import React, { useEffect, useState } from 'react'
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../../App';
import { Dimensions, ImageBackground, Image, StyleSheet, Text, View } from "react-native";
import { RouteProp } from "@react-navigation/native";
import io from 'socket.io-client';
import { SERVER_URL } from "../../utils/socket.js";

const serverURL = SERVER_URL;

const cardBackgroundImage = require("../../Graphics/poker_background.png");

type GameScreenRouteProp = RouteProp<StackParamList, 'Loading'>;

type Props = {
    navigation: StackNavigationProp<StackParamList,'Loading'>;
    route: GameScreenRouteProp;
}

const Loading = ({ navigation, route }: Props) => {
    const { Game } = route.params;
    const [players, setPlayers] = useState(Game.players);
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

    useEffect(() => {
      const socket = io(serverURL);

      // Join the specific game room upon component mount
      socket.emit('joinRoom', { gameId: Game.id });

      // Listen for player updates broadcast by the server
      socket.on('updatePlayers', (updatedPlayers) => {
        setPlayers(updatedPlayers);
      });

      // Cleanup on component unmount
      return () => {
        socket.emit('leaveRoom', { gameId: Game.id });
      };
    }, []);

    useEffect(() => {
      if (players.length === 4) {
        // Update the text right before setting the timeout
        setDisplayText("JOINING...");

        const timer = setTimeout(() => {
          navigation.navigate('Game', { username: Game.players[0].name, Game: Game });
        }, 1000); // 1000 milliseconds = 1 second
    
        return () => clearTimeout(timer); // Cleanup the timer
      }
    }, [players, navigation]);
    

    return (
    <View style={styles.backgroundContainer}>
        {/* Top part of the screen with title */}
        <View style={styles.topContainer}>
            <Text style={styles.header}>{displayText}</Text>
        </View>

        {Game.players.map((player, index) => (
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


const styles = StyleSheet.create({
  avatar: {
    width: 80, // Adjust the size as needed
    height: 80, // Adjust the size as needed
    marginBottom: 10, // Add some margin between avatars
    borderRadius: 40, // Half the width/height to make it a circle
    borderWidth: 2, // Size of border around the avatar
    borderColor: "#FFFFFF", // Border color, assuming white is desired
    backgroundColor: "#C4C4C4", // A placeholder background color in case the image fails to load
    overflow: "hidden", // Ensures that the image does not spill out of the border radius
  },

  backgroundContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#2c2a2a", // Correct property for background color
  },

  topContainer: {
    backgroundColor: "#2c2a2a", // Background color as per your design
    paddingBottom: 10, // Or any other value that fits your design
    alignItems: "center",
  },

  midContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingRight: 220,
  },

  playerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20, // Add some horizontal padding
    width: '100%', // Take full width to contain both label and name
  },

  bottomContainer: {
    position: "absolute",
    bottom: 180,
    width: "100%",
    alignItems: "center",
    height: "60%",
  },

  cardBackground: {
    width: "98%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontFamily: "PixeloidMono",
    color: "#feeb00", // Gold color for the pot amount
    fontSize: 22, // Adjust the size as needed
    width: '50%',
    textAlign: 'left',
  },

  header: {
    fontFamily: "PixeloidMono",
    color: "#feeb00", // Gold color for the pot amount
    fontSize: 36, // Adjust the size as needed
    paddingBottom: 2,
    paddingLeft: 30,
    marginTop: 5,
  },

  playertext: {
    fontFamily: "PixeloidMono",
    color: "#feeb00", // Gold color for the pot amount
    fontSize: 22, // Adjust the size as needed
    width: '70%',
    textAlign: 'left',
  },

});

export default Loading