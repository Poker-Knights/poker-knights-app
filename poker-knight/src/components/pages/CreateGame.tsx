import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "../../../App";
import { useState } from "react";

import {
  Button,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";

type Props = {
  navigation: StackNavigationProp<StackParamList, "Create">;
};

const CreateGame = ({ navigation }: Props) => {
  const [message, setMessage] = useState("");
  const cardBackgroundImage = require("../../Graphics/poker_background.png");

  return (
    <View style={styles.backgroundContainer}>
      {/* Top part of the screen with title */}
      <View style={styles.topContainer}>
        <Text style={styles.header}>POKER KNIGHTS</Text>

        {/* White line */}
        <View style={styles.whiteLine} />
      </View>

      {/* Username Input */}
      <Text style={styles.text}>
        Please enter your user name and click "Create Game" to start a new game
      </Text>
      <TextInput
        style={styles.textInput}
        placeholder="Username"
        value={message}
        placeholderTextColor={"#feeb00"}
        onChangeText={(text) => setMessage(text)}
      />

      {/* Create Game Button */}
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Game")}
      >
        <Text style={styles.text}>Create Game</Text>
      </Pressable>

      {/* Bottom of Screen with Create Game button */}
      <View style={styles.bottomContainer}>
        <ImageBackground
          source={cardBackgroundImage}
          style={styles.cardBackground}
          resizeMode="contain"
        ></ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#2c2a2a", // Correct property for background color
  },

  topContainer: {
    backgroundColor: "#2c2a2a", // Background color as per your design
    paddingBottom: 10, // Or any other value that fits your design
    alignItems: "center",
  },

  bottomContainer: {
    position: "absolute",
    bottom: 230,
    width: "100%",
    alignItems: "center",
    height: "60%",
  },

  cardBackground: {
    width: "98%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontFamily: "PixeloidMono",
    color: "#feeb00", // Gold color for the pot amount
    fontSize: 12, // Adjust the size as needed
    paddingBottom: 2,
    margin: 8,
  },

  header: {
    fontFamily: "PixeloidMono",
    color: "#feeb00", // Gold color for the pot amount
    fontSize: 36, // Adjust the size as needed
    paddingBottom: 2,
    marginTop: 5,
  },

  textInput: {
    fontFamily: "PixeloidMono",
    color: "#feeb00",
    height: 30,
    width: 300,
    margin: 10,
    textAlign: "center",
    borderColor: "#feeb00",
    borderWidth: 2,
    padding: 10,
  },

  whiteLine: {
    height: 2, // Height of the white line
    backgroundColor: "#FFFFFF", // White color for the line
    width: "90%", // Width of the line, adjust as needed
    marginTop: 4, // Space between the text and the line, adjust as needed
  },

  button: {
    marginBottom: 100,
    color: "#feeb00",
    borderRadius: 5,
    borderBlockColor: "#feeb00",
  },
});

export default CreateGame;
