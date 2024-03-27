import React from 'react'
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../../App';

import { ImageBackground, Image, StyleSheet, Text, View } from "react-native";

type Props = {
    navigation: StackNavigationProp<StackParamList,'Loading'>;
}

const Loading = ({ navigation }: Props) => {
    const cardBackgroundImage = require("../../Graphics/poker_background.png");
    const pokerChip = require("../../Graphics/poker_chip.png");

    return (
    <View style={styles.backgroundContainer}>
        {/* Top part of the screen with title */}
        <View style={styles.topContainer}>
            <Text style={styles.header}>LOADING</Text>
        </View>

        <View style={styles.midContainer}>
          <Image
            style={styles.pokerChipImage}
            source={pokerChip}
          ></Image>
        </View>

        {/* Bottom of Screen with poker chip background */}
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

  midContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: "80%",
  },

  bottomContainer: {
    position: "absolute",
    bottom: 180,
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

  pokerChipImage: {
    width: 200,
    height: 200,
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
});

export default Loading