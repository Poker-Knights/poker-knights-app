// App.js
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, SafeAreaView, StatusBar } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "../../../App";

import { Button, Text, View } from "react-native";

type Props = {
  navigation: StackNavigationProp<StackParamList, "Game">;
};

import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import GameScreen from "./GamePage";
import JoinScreen from "./Join";

const App = () => {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <GameScreen />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c2a2a",
  },
});

export default App;
