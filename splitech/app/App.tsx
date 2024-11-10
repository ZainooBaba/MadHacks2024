import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './Home';
import Dashboard from './Dashboard';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
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
    </Stack.Navigator>
  );
};

export default App;
