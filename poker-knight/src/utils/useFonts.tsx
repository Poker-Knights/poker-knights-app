import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { useState, useEffect } from "react";

export function useFonts(fontMap: string | Record<string, Font.FontSource>) {
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
}
