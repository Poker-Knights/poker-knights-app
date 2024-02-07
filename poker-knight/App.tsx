import { StyleSheet, Text, View, SafeAreaView, StatusBar } from "react-native";
import GameScreen from "./src/components/GameScreen";

const App = () => {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <GameScreen />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D", // Example background color, adjust as necessary
  },
});

export default App;
