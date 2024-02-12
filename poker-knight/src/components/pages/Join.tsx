import React from 'react'
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../../App';

import { Button, StyleSheet, Text, View } from "react-native";

type Props = {
    navigation: StackNavigationProp<StackParamList,'Join' >;
}

const Join = ({navigation}: Props) => {
    return (
        <View style={styles.container}>
            <Text 
                style={styles.text}
            >
                Put stuff for the join screen here!
            </Text>

            <Button
                title="Check out game page"
                onPress={() => 
                    navigation.navigate('Game')
                }
            />
        </View>
    );
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

export default Join