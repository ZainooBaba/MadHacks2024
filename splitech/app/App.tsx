import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Home from './Home';
import Dashboard from './Dashboard';
import GroupDetails from './GroupDetails';
import CreateGroup from './CreateGroup';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack.Navigator initialRouteName="createGroup">
        {/* Home Screen */}
        <Stack.Screen 
            name="Home" 
            component={Home} 
            options={{ headerShown: false }} 
        />
        
        {/* Dashboard Screen */}
        <Stack.Screen 
            name="Dashboard" 
            component={Dashboard} 
            options={{ 
            title: 'Dashboard',
            headerStyle: { backgroundColor: '#F4A442' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
            }} 
        />
        {/* Group Screen */}
        <Stack.Screen
            name="GroupDetails"
            component={GroupDetails}
            options={{
              title: 'Group Details',
              headerStyle: { backgroundColor: '#F4A442' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          />

          <Stack.Screen
            name="createGroup"
            component={CreateGroup}
            options={{
              title: 'Create Group',
              headerStyle: { backgroundColor: '#F4A442' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          />
        </Stack.Navigator>
    </GestureHandlerRootView>
  );
};

export default App;
