import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#292626",
      alignItems: "center",
      justifyContent: "flex-start", // Align content to the top
      paddingTop: 30, // Adjust as needed to move everything up
    },
  
    titleContainer: {
      alignItems: "center",
      marginTop: 16, // Adjust as needed for spacing from the top
    },
    title: {
      fontSize: 52,
      fontFamily: "PixeloidMono",
      color: "#faca0f",
      marginBottom: 16, // Reduce the space below the 'READY?' text
    },
    subtitle: {
      fontSize: 24,
      fontFamily: "PixeloidMono",
      color: "#faca0f",
      marginBottom: 4, // Increase as needed for spacing above the knight icon
    },
  
    knightContainer: {
      marginTop: 5,
    },
    knightIcon: {
      height: 285,
      width: 285,
    },
  
    gameIDContainer: {
      marginTop: 20, // Adjust as needed for spacing
      alignItems: "center", // Center children horizontally
      width: "100%", // Take up full container width
    },
    gameIDInput: {
      height: 70, // Adjust as needed
      width: "80%", // Match the width of the button
      backgroundColor: "#fff", // Background color for the input
      borderRadius: 5, // Rounded corners for the input
      paddingHorizontal: 10, // Inner spacing
      fontSize: 18, // Adjust as needed
      fontFamily: "PixeloidMono",
      color: "#000", // Text color
      marginBottom: 30, // Space between input and button
    },
    buttonContainer: {
      width: "80%", // Same width as the input field
      height: 50, // Adjust as needed
      justifyContent: "center", // Center the text vertically
      alignItems: "center", // Center the text horizontally
      overflow: "hidden", // Prevent the image from going outside the button area
    },
    buttonImage: {
      ...StyleSheet.absoluteFillObject, // Position the image absolutely to cover the whole button area
      width: "100%",
      height: "100%",
    },
    buttonText: {
      fontSize: 24, // Adjust as needed
      fontFamily: "PixeloidMono",
      color: "#292626", // Adjust text color to be visible against button background
      position: "absolute", // Position the text over the image
    },
  
    longButton: {
      height: 50, // Height of your button PNG
      width: "80%", // Width as a percentage of the screen width
      // Add more styles if needed
    },
  
    backButton: {
      position: "absolute", // Position it over everything else
      left: 10, // Spacing from the left side of the screen
      bottom: 10, // Spacing from the bottom of the screen
    },
  
    arrowImage: {
      height: 50, // Adjust as needed for your image
      width: 50, // Adjust as needed for your image
      // If the image is not displaying correctly, you may remove the resizeMode or adjust it
    },
  });