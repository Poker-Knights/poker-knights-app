import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Modal, StyleSheet, View, Text, TouchableOpacity } from "react-native";

interface PopupMenuProps {
  visible: boolean;
  onClose: () => void;
}

const PopupMenu: React.FC<PopupMenuProps> = ({ visible, onClose }) => {
  const navigation = useNavigation(); // Initialize useNavigation hook

  const userQuit = (user: number) => {
    navigation.navigate("Home"); // Go home

    //Logic to disconnect player
    /* */
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Poker Game Menu</Text>

          {/* Menu Item: Settings */}
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={() => console.log("Settings Pressed")}
          >
            <Text style={styles.textStyle}>Settings</Text>
          </TouchableOpacity>

          {/* Menu Item: Quit Game */}
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={() => userQuit(1)} // Pass user val
          >
            <Text style={styles.textStyle}>Quit Game</Text>
          </TouchableOpacity>

          {/* Close Menu Button */}
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={onClose}
          >
            <Text style={styles.textStyle}>Close Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
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
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export { PopupMenu };
