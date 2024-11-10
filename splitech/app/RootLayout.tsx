// RootLayout.tsx
import { Stack } from 'expo-router';
import Home from './Home';
import Name from './Name';

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Home' }} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Name" component={Name} />
        </Stack>
    );
}