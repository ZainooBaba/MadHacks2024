// Dashboard.js
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  Pressable,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Link from 'react-native-vector-icons/AntDesign';
import Remove from 'react-native-vector-icons/FontAwesome';
import { Swipeable } from 'react-native-gesture-handler';
import { Share } from 'react-native';

// Sample data
const data = [
  { id: '1', title: 'Card 1', owner: true },
  { id: '2', title: 'Card 2', owner: false },
  { id: '3', title: 'Card 3', owner: true },
  { id: '4', title: 'Card 4', owner: false },
];

// Group management functions
function shareLink(url) {
  Share.share({
    title: 'Check out this link',
    message: `Check out this link: ${url}`,
  }).catch((error) => console.log('Error sharing link:', error));
}

function removeGroup(groupId) {
  Alert.alert(
    'Remove Group',
    'Are you sure you want to remove this group?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        onPress: () => {
          console.log(`Group with ID ${groupId} removed`);
          // Additional logic to update state can go here
        },
        style: 'destructive',
      },
    ],
    { cancelable: true }
  );
}

function addGroup() {
  alert('Add Group');
}

// Card Component
const Card = ({ title, owner, onSwipeOpen }) => {
  const renderLeftActions = () => (
    <View style={[styles.rightActions, styles.cardButtonContainer]}>
      <Pressable style={[styles.cardButtons, styles.editButton]} onPress={() => shareLink('www.Example.com')}>
        <Link name="link" size={40} color="gold" />
      </Pressable>
      <Pressable style={[styles.cardButtons, styles.deleteButton]} onPress={() => removeGroup('EXAMPLE_GROUP_ID')}>
        <Remove name="remove" size={40} color="gold" />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.card_container}>
      {owner && <Icon name="crown" size={20} color="gold" style={styles.crownIcon} />}
      <Swipeable renderLeftActions={renderLeftActions} overshootFriction={10000} onSwipeableOpen={() => onSwipeOpen()}>
        <Pressable style={styles.cardTittleContainer}>
          <View>
            <Text style={styles.title}>{title}</Text>
          </View>
        </Pressable>
      </Swipeable>
    </View>
  );
};

// Dashboard Component
const Dashboard = ({ route, navigation }) => {
  const { user } = route.params;

  // Log out function
  const onLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    navigation.replace('Home');
  };

  // Handle swipe open
  function handleOnSwipeOpen(item) {
    // TODO: Close all other cards or handle swipe open logic
  }

  return (
    <View style={styles.container}>
      {/* User Info Section */}
      {/* <Text style={styles.header}>Welcome to the Dashboard!</Text>
      <Text style={styles.userText}>Name: {user.name}</Text>
      <Text style={styles.userText}>Email: {user.email}</Text> */}

      {/* Group Management Section */}
      <View style={styles.groupContainer}>
        <Text style={styles.subHeader}>Your Groups</Text>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card title={item.title} owner={item.owner} onSwipeOpen={() => handleOnSwipeOpen(item)} />
          )}
          contentContainerStyle={styles.listContainer}
        />
        <TouchableOpacity onPress={addGroup}>
          <Text style={styles.newGroupButton}>New Group</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      {/* Uncomment if you want to enable logout */}
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
  groupContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  subHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
  },
  listContainer: {
    padding: 10,
  },
  card_container: {
    backgroundColor: '#fff',
    marginBottom: 24,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardTittleContainer: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  crownIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 5,
  },
  title: {
    fontSize: 26,
    color: '#111827',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardButtonContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
  cardButtons: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
  newGroupButton: {
    textAlign: 'center',
    padding: 10,
    color: 'blue',
    fontSize: 18,
    marginTop: 10,
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
