// Dashboard.js
import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { Swipeable } from 'react-native-gesture-handler';

const data = [
  { id: '1', title: 'Group 1', owner: true },
  { id: '2', title: 'Group 2', owner: false },
  { id: '3', title: 'Group 3', owner: true },
  { id: '4', title: 'Group 4', owner: false },
];

// Card component that is clickable
const Card = ({ title, owner, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
    {owner && <Icon name="crown" size={20} color="gold" style={styles.crownIcon} />}
    <View style={styles.cardTitleContainer}>
      <Text style={styles.title}>{title}</Text>
    </View>
  </TouchableOpacity>
);

const Dashboard = ({ navigation }) => {
  const handleCardPress = (groupName) => {
    navigation.navigate('GroupDetails', { groupName });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to the Dashboard!</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            title={item.title}
            owner={item.owner}
            onPress={() => handleCardPress(item.title)}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
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
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingTop: 10,
  },
  cardContainer: {
    backgroundColor: '#fff',
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
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
  cardTitleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#111827',
  },
});
