import * as Font from "expo-font";
import { useState, useEffect } from "react";

export function useFonts(fontMap: string | Record<string, Font.FontSource>) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync(fontMap);
      setLoaded(true);
    }

    loadFonts();
  }, []);

  return loaded;
}
