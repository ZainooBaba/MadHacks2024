import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Button } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase, ref, get, set } from 'firebase/database';

// Function to encode email address
const encodeEmail = (email) => {
    return email.replace('.', ',').replace('#', ',').replace('$', ',').replace('[', ',').replace(']', ',');
};

const Name = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchEmail = async () => {
            const storedEmail = await AsyncStorage.getItem('email');
            if (storedEmail) {
                setEmail(storedEmail);
            }
        };
        fetchEmail();
    }, []);

    const saveName = async () => {
        const db = getDatabase();
        const encodedEmail = encodeEmail(email);
        const userRef = ref(db, `Users/${encodedEmail}`);
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
            await set(userRef, { name });
        }

        await AsyncStorage.setItem('name', name).then(() => {
            if (name){
                navigation.replace('Dashboard', {});
            }
        });
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
            />
            <Button title="Save" onPress={saveName} />
        </View>
    );
};

export default Name;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        width: '80%',
    },
});