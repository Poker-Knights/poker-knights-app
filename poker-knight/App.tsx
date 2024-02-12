import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Game } from "./src/types/Game";
import { Player } from "./src/types/Player";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
