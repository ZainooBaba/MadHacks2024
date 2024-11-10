import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import Home from './Home';
import Dashboard from './Dashboard';
import Name from './Name';
const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <Stack.Navigator initialRouteName="Home">
                {/* Home Screen */}
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{headerShown: false}}
                />

                {/* Dashboard Screen */}
                <Stack.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{
                        title: 'Dashboard',
                        headerStyle: {backgroundColor: '#F4A442'},
                        headerTintColor: '#fff',
                        headerTitleStyle: {fontWeight: 'bold'},
                    }}
                />
                <Stack.Screen
                    name="Name"
                    component={Name}
                    options={{
                        title: 'Name',
                        headerStyle: {backgroundColor: '#F4A442'},
                        headerTintColor: '#fff',
                        headerTitleStyle: {fontWeight: 'bold'},
                    }}
                />
            </Stack.Navigator>
        </GestureHandlerRootView>
    );
};

export default App;
