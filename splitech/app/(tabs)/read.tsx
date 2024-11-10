import Ionicons from '@expo/vector-icons/Ionicons';
import {StyleSheet, Image, Platform, Pressable, Button} from 'react-native';
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { firebaseConfig } from '../../firebaseConfig';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {useEffect, useState} from "react";

if (!getApps().length) {
    initializeApp(firebaseConfig);
}
const database = getDatabase();

export default function TabThreeScreen() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const dbRef = ref(database, 'users/123/');
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setItems(Object.values(data));
                console.log('Fetched items:', Object.values(data));
            }
        });
    }, []);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
            <ThemedView style={styles.container}>
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <ThemedText key={index}>{item}</ThemedText>
                    ))
                ) : (
                    <ThemedText>No items found</ThemedText>
                )}
                <ThemedText>This app includes example code to help you get started.</ThemedText>
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    item: {
        padding: 10,
        marginVertical: 8,
        backgroundColor: '#f9c2ff',
    },
});
