import { StyleSheet } from "react-native";

export const GameScreenStyles = StyleSheet.create({
	backgroundContainer: {
		flex: 1,
		backgroundColor: "#292626",

		// // Delete this
		// borderWidth: 1,
		// borderColor: "white",
	},

	cardBackground: {
		width: "100%",
		height: "100%",
	},

	exitButton: {
		alignSelf: "flex-start",
		justifyContent: "center",

		margin: 15,
		padding: 8,

		backgroundColor: "#333",

		borderRadius: 20,

		shadowColor: "#000",
		shadowOffset: {
			width: 2,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
	},

	exitText: {
		fontFamily: "PixeloidMono",
		color: "#feeb00",
		fontSize: 20,
	},

	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22,
	},

	exitModalPopupView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},

	modalText: {
		fontFamily: "PixeloidMono",
		marginBottom: 15,
		textAlign: "center",
	},

	exitGameModalButton: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
		marginTop: 10,
		backgroundColor: "#feeb00",
		borderColor: "black",
		borderStyle: "solid",
		borderWidth: 5,
	},

	textStyle: {
		fontFamily: "PixeloidMono",
		color: "black",
		//fontWeight: "bold",
		textAlign: "center",
	},

	winModalPopupView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},

	loseModalPopupView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},

	gif: {
		width: 100, // Adjust the size as needed
		height: 100, // Adjust the size as needed
		borderRadius: 40, // Half the width/height to make it a circle
		overflow: "hidden", // Ensures that the image does not spill out of the border radius
	},

	topContainer: {
		backgroundColor: "#292626",

		margin: 5,
		alignItems: "center",
	},

	potText: {
		fontFamily: "PixeloidMono",
		color: "#feeb00",
		fontSize: 36,

		paddingBottom: 2,
	},

	currentBetText: {
		fontFamily: "PixeloidMono",
		color: "#feeb00",
		fontSize: 14,
	},

	whiteLine: {
		height: 2,
		backgroundColor: "#FFFFFF",
		width: "80%",

		marginVertical: 5,
	},

	playersContainer: {
		flexDirection: "row",
		justifyContent: "center", // This will distribute your player containers evenly across the top
		height: 200,
		alignItems: "flex-end",
		marginTop: 5,
	},

	playerLeft: {
		position: "absolute",
		left: 5, // Adjust based on your design needs
		bottom: 5, // Lower the left player to create a triangle formation
	},

	playerMiddle: {
		position: "absolute",
		bottom: 30, // Adjust based on your design needs, this should be the highest point
	},

	playerRight: {
		position: "absolute",
		right: 5, // Adjust based on your design needs
		bottom: 5, // Lower the right player to create a triangle formation
	},

	avatar: {
		width: 80, // Adjust the size as needed
		height: 80, // Adjust the size as needed
		borderRadius: 40, // Half the width/height to make it a circle
		borderWidth: 1, // Size of border around the avatar
		borderColor: "#FFFFFF", // Border color, assuming white is desired
		backgroundColor: "#C4C4C4", // A placeholder background color in case the image fails to load
		overflow: "hidden", // Ensures that the image does not spill out of the border radius
	},

	activeTurnAvatar: {
		width: 80, // Adjust the size as needed
		height: 80, // Adjust the size as needed
		borderRadius: 40, // Half the width/height to make it a circle
		borderWidth: 2, // Size of border around the avatar
		borderColor: "#feeb00", // Border color, assuming white is desired
		backgroundColor: "#C4C4C4", // A placeholder background color in case the image fails to load
		overflow: "hidden", // Ensures that the image does not spill out of the border radius
	},

	foldedAvatar: {
		width: 80, // Adjust the size as needed
		height: 80, // Adjust the size as needed
		borderRadius: 40, // Half the width/height to make it a circle
		borderWidth: 2, // Size of border around the avatar
		borderColor: "#FF0000", // Border color, assuming white is desired
		backgroundColor: "#C4C4C4", // A placeholder background color in case the image fails to load
		opacity: 0.35,
		overflow: "hidden", // Ensures that the image does not spill out of the border radius
	},

	playerContainer: {
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
		// If you need to space out the player containers evenly, you might consider additional layout styling here
	},

	blindIcon: {
		width: 45,
		height: 45,

		marginLeft: 65,
		marginTop: 50,
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

	riverCardContainer: {
		flexDirection: "row",

		// Centers in dead middle
		position: "absolute",
		top: "50%",
		right: 0,
		left: 0,

		// Scale down the elements by 20 percent
		transform: [{ scale: 0.8 }],

		justifyContent: "center",
		alignItems: "center",
	},

	// THIS NEEDS TO BE ALTERED
	bottomContainer: {
		position: "absolute",
		bottom: "25%",
		left: 0,
		right: 0,
		// marginHorizontal: 10,

		// height: "60%",
	},

	// THIS ALSO NEEDS TO BE ALTERED
	displayTextStyle: {
		fontFamily: "PixeloidMono",
		color: "#feeb00",
		//fontWeight: "bold",
		textAlign: "center",
		fontSize: 20,
		textTransform: "uppercase",

		// backgroundColor: "#333",
		// borderWidth: 2,
		// borderRadius: 10,
		// borderColor: "#555",
	},

	handCardContainer: {
		flexDirection: "row",

		position: "absolute",
		bottom: "8%",
		right: "10%",

		zIndex: 2,

		justifyContent: "center",
		alignItems: "center",
	},

	parentToChipCountAndButtons: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,

		margin: 20,
	},

	clientChipCountContainer: {
		backgroundColor: "#292626",
	},

	clientChipCountText: {
		fontFamily: "PixeloidMono",
		color: "#feeb00",
		fontSize: 16,
	},

	actionButtonsContainer: {
		backgroundColor: "#333",

		borderWidth: 2,
		borderRadius: 10,
		borderColor: "#555",
	},

	allInButtonContainer: {
		marginTop: 10,
		marginHorizontal: 10,
	},

	allInButtonText: {
		fontFamily: "PixeloidMono",
		color: "#feeb00",
		fontSize: 20,
	},

	foldButtonContainer: {
		margin: 10,
	},

	foldButtonText: {
		fontFamily: "PixeloidMono",
		color: "#feeb00",
		fontSize: 20,
	},

	raiseCallButtonContainer: {
		flexDirection: "row",
		marginBottom: 10,
		marginHorizontal: 10,
	},

	raiseCallValueText: {
		fontFamily: "PixeloidMono",
		color: "#feeb00",
		fontSize: 20,
		marginRight: 8,
	},
});
