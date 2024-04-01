import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#292626",
    alignItems: "center",
    justifyContent: "center", // Center content vertically
    paddingTop: 10, // Adjust as needed to move everything up
  },
  knightContainer: {
    marginTop: 0,
  },
  knightIcon: {
    height: 350,
    width: 350,
  },
  buttonsContainer: {
    flex: 1,
    marginTop: 5,
    width: "100%", // Ensure the container takes up the full width
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  buttonContainer: {
    width: "100%", // Adjust the width percentage as needed
    height: 75, // Adjust as needed
    marginVertical: 15, // Add margin between buttons
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  buttonImage: {
    width: "100%", // Ensure the image takes up the full width of the button
    height: "110%", // Ensure the image takes up the full height of the button
  },
  usernameContainer: {
    marginTop: 35, // Adjust as needed for spacing
    alignItems: "center", // Center children horizontally
    width: "100%", // Take up full container width
  },
  usernameInput: {
    height: 80, // Adjust as needed
    width: "90%", // Match the width of the button
    backgroundColor: "#fff", // Background color for the input
    borderRadius: 5, // Rounded corners for the input
    paddingHorizontal: 10, // Inner spacing
    fontSize: 28, // Adjust as needed
    fontFamily: "PixeloidMono",
    color: "#000", // Text color
    marginBottom: 10, // Space between input and button
  },
  modalView: {
    alignItems: "center",
  },
});
