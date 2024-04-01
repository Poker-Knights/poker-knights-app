import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    avatar: {
      width: 80, // Adjust the size as needed
      height: 80, // Adjust the size as needed
      marginBottom: 10, // Add some margin between avatars
      borderRadius: 40, // Half the width/height to make it a circle
      borderWidth: 2, // Size of border around the avatar
      borderColor: "#FFFFFF", // Border color, assuming white is desired
      backgroundColor: "#C4C4C4", // A placeholder background color in case the image fails to load
      overflow: "hidden", // Ensures that the image does not spill out of the border radius
    },
  
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
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingRight: 220,
    },
  
    playerContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingHorizontal: 20, // Add some horizontal padding
      width: '100%', // Take full width to contain both label and name
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
  
    text: {
      fontFamily: "PixeloidMono",
      color: "#feeb00", // Gold color for the pot amount
      fontSize: 22, // Adjust the size as needed
      width: '50%',
      textAlign: 'left',
    },
  
    header: {
      fontFamily: "PixeloidMono",
      color: "#feeb00", // Gold color for the pot amount
      fontSize: 36, // Adjust the size as needed
      paddingBottom: 2,
      paddingLeft: 30,
      marginTop: 5,
    },
  
    playertext: {
      fontFamily: "PixeloidMono",
      color: "#feeb00", // Gold color for the pot amount
      fontSize: 22, // Adjust the size as needed
      width: '70%',
      textAlign: 'left',
    },
  
  });