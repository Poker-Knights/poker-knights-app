// App.js
import React, { RefObject, useRef, useEffect, useState, useContext, createContext } from "react";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import io, { Socket } from "socket.io-client";

import HomeScreen from "./src/components/pages/HomeScreen";
import JoinScreen from "./src/components/pages/JoinGameScreen";
import GameScreen from "./src/components/pages/GameScreen";
import LoadingScreen from "./src/components/pages/LoadingScreen";
import AppLoading from "expo-app-loading";
import { useFonts } from "./src/utils/useFonts";
import { SERVER_URL } from './src/utils/socket'; // Make sure you have the correct path to your server URL
import { Game } from "./src/types/Game";
//import { playerCount } from "./src/utils/Game";

// Create a type that can be either a socket or null
type SocketRef = RefObject<Socket | null>;

// Create a context for the socket
const SocketContext = createContext<SocketRef | null>(null);

// I need Game Screen to take the parameters of gameID, players, and playerCount
// I need to pass the parameters to Game Screen from Home Screen
export type StackParamList = {
  Home: undefined;
  Join: { username: string };
  Game: { username: string; Game: Game };
  Loading: { Game: Game, username: string };
};

const Stack = createStackNavigator<StackParamList>();

export default function App() {
  const [fontsLoaded, loadFonts] = useFonts({
    PixeloidMono: require("./assets/fonts/PixeloidMono.ttf"), // Make sure the path is correct
  });

  // Create a ref for the socket
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize the socket connection
    socketRef.current = io(SERVER_URL, { transports: ['websocket'] });

    // Cleanup function to close the socket when the app is closed/unmounted
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [SERVER_URL]);

  useEffect(() => {
    loadFonts(); // This function is now guaranteed to be callable
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SocketContext.Provider value={socketRef}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Join" component={JoinScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen name="Loading" component={LoadingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SocketContext.Provider>
  );
}

// Export the context so it can be imported and used in other components
export { SocketContext };