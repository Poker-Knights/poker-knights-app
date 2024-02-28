import React from 'react'
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../../App';

import { Button, StyleSheet, Text, View } from "react-native";

type Props = {
    navigation: StackNavigationProp<StackParamList,'Home' >;
}

const Home = ({navigation}: Props) => {
    return (
        <View style={styles.container}>
            <Text 
                style={styles.text}
            >
                Put stuff for the home screen here!
            </Text>
            <Button
                title="Create Game"
                onPress={() => 
                    navigation.navigate('Create')
                }
            />
            <Button
                title="Join Game"
                onPress={() => 
                    navigation.navigate('Join')
                }
            />
            <Button
                title="Loading"
                onPress={() => 
                    navigation.navigate('Loading')
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
});

export default Home