import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>-----------------------------------</Text>
      <Text>{'-> Insert Poker Knight app here! <-'}</Text>
      <Text>David was here!</Text>
      <Text>Sri was here!</Text>
      <Text>Matthew was here!</Text>
      <Text>-----------------------------------</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
