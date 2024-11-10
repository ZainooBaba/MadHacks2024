import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, FlatList } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase, ref, get, set } from 'firebase/database';

// Sample profile images
const profilePictures = [
  require('../assets/icons/image_part_001.jpg'),
  require('../assets/icons/image_part_002.jpg'),
  require('../assets/icons/image_part_003.jpg'),
  require('../assets/icons/image_part_004.jpg'),
  require('../assets/icons/image_part_005.jpg'),
  require('../assets/icons/image_part_006.jpg'),
  require('../assets/icons/image_part_007.jpg'),
  require('../assets/icons/image_part_008.jpg'),
  require('../assets/icons/image_part_009.jpg'),
];

const encodeEmail = email => email.replace(/[.#$[\]]/g, ',');
  
const Name = ({ navigation }) => {
  const [name, setName] = useState('');
  const [selectedPicture, setSelectedPicture] = useState(null);
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

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Invalid Input', 'Please enter your name.');
      return;
    }
    if (!selectedPicture) {
      Alert.alert('No Profile Picture', 'Please select a profile picture.');
      return;
    }
    try {
        const db = getDatabase();
        const encodedEmail = encodeEmail(email);
        const userRef = ref(db, `Users/${encodedEmail}`);
        const snapshot = await get(userRef);
  
        if (!snapshot.exists()) {
          await set(userRef, { name, selectedPicture });
        }
  
        await AsyncStorage.setItem('name', name);
        await AsyncStorage.setItem('pfpId', selectedPicture); // Save profile picture ID to AsyncStorage
        navigation.replace('Dashboard');
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'Could not save your name. Please try again.');
      }
    // Here, save the name and selected picture in your storage or database
    // navigation.replace('Dashboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter Your Name</Text>
      <Text style={styles.prompt}>We’ll use this name in your profile and for all interactions.</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        placeholderTextColor="#AAA"
        value={name}
        onChangeText={setName}
      />
      
      <Text style={styles.selectPrompt}>Choose a Profile Picture</Text>
      <FlatList
        data={profilePictures}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedPicture(item)}>
            <Image
              source={item}
              style={[
                styles.profilePicture,
                selectedPicture === item && styles.selectedPicture,
              ]}
            />
          </TouchableOpacity>
        )}
        numColumns={2}
        contentContainerStyle={styles.pictureContainer}
      />

      <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
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
  selectPrompt: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  pictureContainer: {
    justifyContent: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    margin: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPicture: {
    borderColor: '#2D9CDB', // Highlight color for selected picture
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
