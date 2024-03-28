// App.js
import React, { useEffect, useState } from "react";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./src/components/pages/HomeScreen";
import JoinScreen from "./src/components/pages/JoinGameScreen";
import GameScreen from "./src/components/pages/GameScreen";
import LoadingScreen from "./src/components/pages/LoadingScreen";
import AppLoading from "expo-app-loading";
import { useFonts } from "./src/utils/useFonts";
import { Game } from "./src/types/Game";
//import { playerCount } from "./src/utils/Game";

// I need Game Screen to take the parameters of gameID, players, and playerCount
// I need to pass the parameters to Game Screen from Home Screen
export type StackParamList = {
  Home: undefined;
  Join: { username: string };
<<<<<<< HEAD
  Game: { username: string; Game: Game };
  Loading: { Game: Game };
=======
  Game: { Game: Game };
>>>>>>> 42b3bb95c778a26a5ab9f1d13bb98f2871234be2
};

const Stack = createStackNavigator<StackParamList>();

export default function App() {
  const [fontsLoaded, loadFonts] = useFonts({
    PixeloidMono: require("./assets/fonts/PixeloidMono.ttf"), // Make sure the path is correct
  });

  useEffect(() => {
    loadFonts(); // This function is now guaranteed to be callable
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Join" component={JoinScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Loading" component={LoadingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
