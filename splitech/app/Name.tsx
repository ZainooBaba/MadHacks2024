import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

const Name = ({ navigation }) => {
  const [name, setName] = useState('');

  const handleSaveName = () => {
    if (!name.trim()) {
      Alert.alert('Invalid Input', 'Please enter your name.');
      return;
    }
    // Proceed to the dashboard after setting the name
    navigation.replace('Dashboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter Your Name</Text>
      <Text style={styles.prompt}>
        We’ll use this name in your profile and for all interactions.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        placeholderTextColor="#AAA"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={handleSaveName}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Name;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D9CDB',
    marginBottom: 15,
    textAlign: 'center',
  },
  prompt: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginHorizontal: 10,
    marginBottom: 20,
  },
  input: {
    width: '90%',
    padding: 15,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#F4A442',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    width: '60%',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
