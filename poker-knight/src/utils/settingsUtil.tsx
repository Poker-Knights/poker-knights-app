// utilities/settingsUtils.ts
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { StackParamList } from "../../App";

type Props = {
  navigation: StackNavigationProp<StackParamList, "Home">;
};

const handleSettingsPress = () => {
  console.log("Settings pressed");
};

const handleUserQuit = (userID: number) => {
  const navigation = useNavigation(); // Get navigation object

  if (navigation) {
    navigation.navigate("Home"); // Go home
  }

  //Logic to disconnect player
  /* */
};

export { handleSettingsPress, handleUserQuit };
