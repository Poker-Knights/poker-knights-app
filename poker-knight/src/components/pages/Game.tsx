// App.js
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack"
import { StyleSheet, SafeAreaView, StatusBar } from "react-native";

import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../../App';

import { Button, Text, View } from "react-native";

type Props = {
    navigation: StackNavigationProp<StackParamList,'Game' >;
}

import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import GameScreen from "./GamePage";




const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      PixeloidMono: require("../../../assets/fonts/PixeloidMono.ttf"), // Replace with the correct path to your font file
    });
    setFontsLoaded(true);
  };

  if (!fontsLoaded) {
    return (
      <AppLoading
        startAsync={loadFonts}
        onFinish={() => setFontsLoaded(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#2c2a2a" />
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