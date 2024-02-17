// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./src/components/pages/Home";
import CreateScreen from "./src/components/pages/CreateGame";
import JoinScreen from "./src/components/pages/Join";
import GameScreen from "./src/components/pages/Game";

export type StackParamList = {
  Home: undefined;
  Create: undefined;
  Join: undefined;
  Game: undefined;
};

const Stack = createStackNavigator<StackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Create" component={CreateScreen} />
        <Stack.Screen name="Join" component={JoinScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
