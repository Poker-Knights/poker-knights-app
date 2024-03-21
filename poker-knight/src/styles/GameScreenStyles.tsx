import { StyleSheet } from "react-native";

export const GameScreenStyles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: "#292626", // Correct property for background color
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

  settingsButton: {
    position: "absolute",
    left: 10, // Adjust as needed
    top: 6,
    // ... Other styles for the settings button
  },

  settingsIcon: {
    marginTop: 20,
    marginLeft: 10,
    width: 30, // Adjust as needed
    height: 30, // Adjust as needed
    // ... Other styles for the settings icon
  },

  topContainer: {
    backgroundColor: "#292626", // Background color as per your design
    paddingBottom: 10, // Or any other value that fits your design
    alignItems: "center",
    marginTop: 50,
  },
  potText: {
    fontFamily: "PixeloidMono",
    color: "#feeb00", // Gold color for the pot amount
    fontSize: 36, // Adjust the size as needed
    paddingBottom: 2,
  },
  currentBetText: {
    fontFamily: "PixeloidMono",
    color: "#feeb00", // Gold color for the current bet amount
    fontSize: 14, // Adjust the size as needed
  },

  whiteLine: {
    height: 2, // Height of the white line
    backgroundColor: "#FFFFFF", // White color for the line
    width: "80%", // Width of the line, adjust as needed
    marginTop: 4, // Space between the text and the line, adjust as needed
  },

  // avatar: {
  //   width: 80, // Adjust the size as needed
  //   height: 80, // Adjust the size as needed
  //   borderRadius: 40, // Half the width/height to make it a circle
  //   borderWidth: 2, // Size of border around the avatar
  //   borderColor: "#FFFFFF", // Border color, assuming white is desired
  //   backgroundColor: "#C4C4C4", // A placeholder background color in case the image fails to load
  // },

  avatar: {
    width: 80, // Adjust the size as needed
    height: 80, // Adjust the size as needed
    borderRadius: 40, // Half the width/height to make it a circle
    borderWidth: 2, // Size of border around the avatar
    borderColor: "#FFFFFF", // Border color, assuming white is desired
    backgroundColor: "#C4C4C4", // A placeholder background color in case the image fails to load
    overflow: "hidden", // Ensures that the image does not spill out of the border radius
  },
  playerName: {
    fontFamily: "PixeloidMono",
    color: "#feeb00", // Assuming a gold color for the player's name text
    fontSize: 16, // Adjust the size as needed
    marginTop: 4, // Space between the avatar and the name
  },
  playerMoney: {
    fontFamily: "PixeloidMono",
    color: "#feeb00", // Assuming white color for the player's money text
    fontSize: 14, // Adjust the size as needed
    marginTop: 2, // Space between the name and the money
  },
  playersContainer: {
    flexDirection: "row",
    justifyContent: "center", // This will distribute your player containers evenly across the top
    height: 250,
    alignItems: "flex-end",
  },
  playerContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    // If you need to space out the player containers evenly, you might consider additional layout styling here
  },
  playerLeft: {
    position: "absolute",
    left: 5, // Adjust based on your design needs
    bottom: 5, // Lower the left player to create a triangle formation
  },
  playerMiddle: {
    position: "absolute",
    bottom: 100, // Adjust based on your design needs, this should be the highest point
  },
  playerRight: {
    position: "absolute",
    right: 5, // Adjust based on your design needs
    bottom: 5, // Lower the right player to create a triangle formation
  },
  actionButtonsContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "11%",
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#333", // Background color
    borderColor: "#555", // Border color
    borderWidth: 2, // Border width
    borderRadius: 10, // Border radius
  },
  modalView: {
    alignItems: "center",
  },
  actionButtonText: {
    fontFamily: "PixeloidMono",
    color: "#feeb00", // Assuming white color for the player's money text
    fontSize: 20, // Adjust the size as needed
    bottom: 15,
    paddingTop: 10,
  },
  topButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  raiseButtonContainer: {
    flexDirection: "row",
    padding: 2,
    marginRight: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  raiseValueText: {
    fontFamily: "PixeloidMono",
    color: "#feeb00",
    fontSize: 20,
    padding: 4,
  },
  callButtonContainer: {
    flexDirection: "row",
    marginRight: 0,
  },
  callButtonText: {
    fontFamily: "PixeloidMono",
    color: "#feeb00",
    fontSize: 20,
  },
  bottomButtonsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  allInButtonContainer: {
    paddingHorizontal: 30,
  },
  allInButtonText: {
    fontFamily: "PixeloidMono",
    color: "#feeb00",
    fontSize: 20,
    alignContent: "space-around",
  },
  foldButtonContainer: {
    paddingHorizontal: 30,
  },
  foldButtonText: {
    fontFamily: "PixeloidMono",
    color: "#feeb00",
    fontSize: 20,
  },
  checkButtonContainer: {
    paddingHorizontal: 10,
    marginRight: 25,
  },
  checkButtonText: {
    fontFamily: "PixeloidMono",
    color: "#feeb00",
    fontSize: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc', // Grey color
  },
  

  clientChipCountContainer: {
    // Position it towards the bottom-left part of the bottomContainer
    left: 10, // Adjust as needed for padding from the left edge
    bottom: -200, // Adjust as needed to position above the action buttons
    backgroundColor: '#292626', // Slightly darker background for readability
    padding: 5,
    borderRadius: 5,
  },
  
  clientChipCountText: {
    color: '#feeb00',
    fontSize: 16,
    fontFamily: 'PixeloidMono',
  },

  labelText: {
    // Style for the RAISE/CHECK/CALL label text
    color: '#feeb00', // Use the same color as your raiseValueText for consistency
    fontFamily: 'PixeloidMono',
    fontSize: 20, // Adjust the size as needed
    marginRight: 4, 
    marginHorizontal: 4, // This adds spacing on both sides of the value,// Add some margin to the right of the label
    // Add other styles as necessary
  },
});
