import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ImageBackground,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
const GameScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.potText}>Pot: $16,538</Text>
      </View>

      <View style={styles.communityCardsContainer}>
        <Text style={styles.playerTurnText}>Billy's Turn</Text>
        <Text> Table Visuals Go Here</Text>
      </View>

      <ImageBackground
        source={require("../imgs/gridbackground.png")} // Testing how inserting own images works
        resizeMode="repeat"
        style={styles.playerCardsBackground}
      >
        <View style={styles.playerCardsContainer}>
          {/* Display the player's hand here */}
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={[styles.actionButton, styles.foldButton]}>
            <Text style={styles.actionButtonText}>Fold</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Check</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Raise</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.allInButton]}>
            <Text style={styles.actionButtonText}>All in</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#691F01",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    marginTop: 10,
    paddingBottom: 25,
  },
  potText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  playerTurnText: {
    fontSize: 18,
    fontStyle: "italic",
    color: "white",
    top: 20,
    position: "absolute",
    alignSelf: "center",
  },
  communityCardsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "55%",
    padding: 16,
    backgroundColor: "013220",
  },
  cardImage: {
    width: 60,
    height: 90,
    resizeMode: "contain",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 50,
    width: "100%",
  },
  actionButton: {
    backgroundColor: "#fff",
    padding: 0,
    height: 45,
    width: 45,
    borderRadius: 45 / 2, // Half of the width/height to make it perfectly round
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center", // Center the child horizontally
    justifyContent: "center", // Center the child vertically
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  foldButton: {
    backgroundColor: "#ff0000", // Red color for the fold button
  },
  allInButton: {
    backgroundColor: "#00ff00", // Green color for the all-in button
  },

  playerCardsBackground: {
    width: "100%",
    height: "55%",
    justifyContent: "center",
    alignItems: "center",
  },
  playerCardsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    // No padding needed here as it is inside the background now
  },
});

export default GameScreen;
