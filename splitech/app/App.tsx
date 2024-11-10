import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import Home from './Home';
import Name from './Name';
import Dashboard from './Dashboard';
import GroupDetails from './GroupDetails';
import TransactionDetails from './TransactionDetails';
import CalculationResults from './CalculationResults';
import CreateGroup from './CreateGroup';
import AddTransaction from './AddTransaction';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
            <Stack.Screen 
                name="CreateGroup" 
                component={CreateGroup} 
                options={{ 
                title: 'Create Group',
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
            {/* Transaction Details */}
            <Stack.Screen
                name="TransactionDetails"
                component={TransactionDetails}
                options={{
                title: 'Transaction Details',
                headerStyle: { backgroundColor: '#F4A442' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
                }}
            />
            {/* Transaction Details */}
            <Stack.Screen
                name="CalculationResults"
                component={CalculationResults}
                options={{
                title: 'Calculation Results',
                headerStyle: { backgroundColor: '#F4A442' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
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
            <Stack.Screen
                name="AddTransaction"
                component={AddTransaction}
                options={{
                    title: 'Add Transaction',
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
