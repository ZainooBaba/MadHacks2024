// Dashboard.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Dashboard = ({ route, navigation }) => {
  const { user } = route.params; // Receive user data from navigation

  // Log out logic, bugged rn so commenting it out
  const onLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    navigation.replace('Home'); // Navigate back to Home screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to the Dashboard!</Text>
      <Text style={styles.userText}>Name: {user.name}</Text>
      <Text style={styles.userText}>Email: {user.email}</Text>
      {/* Add more user info or functionalities as needed */}
      {/* <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={onLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  userText: {
    fontSize: 20,
    color: '#111827',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#F4A442',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  logoutButton: {
    backgroundColor: '#EB5757',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
