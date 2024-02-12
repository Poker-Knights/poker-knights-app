// App.js
import React, { useState } from "react";
import { StyleSheet, SafeAreaView, StatusBar } from "react-native";
import GameScreen from "./src/components/GameScreen";

import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      PixeloidMono: require("./assets/fonts/PixeloidMono.ttf"), // Replace with the correct path to your font file
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
