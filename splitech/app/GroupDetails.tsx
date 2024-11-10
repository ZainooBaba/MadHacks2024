// GroupDetails.js
import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const GroupDetails = ({ route }) => {
  const { groupName } = route.params;

  // Sample data for transactions with amounts
  const transactions = [
    { id: '1', title: 'Transaction 1', amount: 25.50 },
    { id: '2', title: 'Transaction 2', amount: 100.00 },
    { id: '3', title: 'Transaction 3', amount: 75.25 },
  ];

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionCard}>
      <Text style={styles.transactionTitle}>{item.title}</Text>
      <Text style={styles.transactionAmount}>${item.amount.toFixed(2)}</Text>
    </View>
  );

  const handleAddTransaction = () => {
    // Logic to add a new transaction will be implemented later
    console.log('Add transaction');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.groupName}>{groupName}</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={styles.transactionList}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddTransaction}>
        <AntDesign name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default GroupDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  groupName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  transactionList: {
    paddingTop: 10,
  },
  transactionCard: {
    backgroundColor: '#F3F4F6',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    position: 'relative',
  },
  transactionTitle: {
    fontSize: 18,
    color: '#333',
  },
  transactionAmount: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D9CDB', // Styled in blue to stand out
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#F4A442',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
