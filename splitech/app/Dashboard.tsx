// Dashboard.js
import React from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, TouchableOpacity, Alert } from 'react-native';
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
const Card = ({ title, owner, onPress, onSwipeOpen }) => {
  const renderLeftActions = () => (
    <View style={styles.leftActionContainer}>
      <Pressable style={[styles.cardButtons, styles.editButton]} onPress={() => shareLink('www.Example.com')}>
        <Link name="link" size={40} color="#fff" />
      </Pressable>
      <Pressable style={[styles.cardButtons, styles.deleteButton]} onPress={() => removeGroup('EXAMPLE_GROUP_ID')}>
        <Remove name="remove" size={40} color="#fff" />
      </Pressable>
    </View>
  );

  return (
    <Swipeable renderLeftActions={renderLeftActions} onSwipeableOpen={onSwipeOpen}>
      <Pressable onPress={onPress} style={styles.cardContainer}>
        {owner && <Icon name="crown" size={20} color="gold" style={styles.crownIcon} />}
        <Text style={styles.title}>{title}</Text>
      </Pressable>
    </Swipeable>
  );
};

// Dashboard Component
const Dashboard = ({ route, navigation }) => {
  const { user } = route.params;

  const onLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    navigation.replace('Home');
  };

  const handleCardPress = (groupName) => {
    navigation.navigate('GroupDetails', { groupName });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subHeader}>Your Groups</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            title={item.title}
            owner={item.owner}
            onPress={() => handleCardPress(item.title)}
            onSwipeOpen={() => console.log("Swipe opened for", item.title)}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity onPress={addGroup}>
        <Text style={styles.newGroupButton}>New Group</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  subHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
    textAlign: 'center',
  },
  listContainer: {
    padding: 10,
  },
  cardContainer: {
    backgroundColor: '#fff',
    marginBottom: 20,
    padding: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  crownIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  title: {
    fontSize: 26,
    color: '#111827',
  },
  leftActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    overflow: 'hidden', // Ensures the rounded corners apply to swipe buttons
    marginBottom: 20,
  },
  cardButtons: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
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
});
