// useFonts.js
import * as Font from "expo-font";
import { useState } from "react";

export function useFonts(fontMap: {
  [key: string]: Font.FontSource;
}): [boolean, () => Promise<void>] {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async (): Promise<void> => {
    try {
      await Font.loadAsync(fontMap);
      setFontsLoaded(true);
    } catch (error) {
      console.warn(error);
    }
  };

  return [fontsLoaded, loadFonts];
}
