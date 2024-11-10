// GroupDetails.js
import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const transactions = [
  { id: '1', title: 'Groceries', amount: 25.50, members: ['Alice', 'Bob'], description: 'Weekly groceries', creator: 'Alice' },
  { id: '2', title: 'Gas', amount: 100.00, members: ['Alice', 'Charlie'], description: 'Road trip fuel', creator: 'Charlie' },
  { id: '3', title: 'Dinner', amount: 75.25, members: ['Bob', 'Charlie', 'Alice'], description: 'Dinner at a restaurant', creator: 'Bob' },
];

const GroupDetails = ({ route, navigation }) => {
  const { groupName } = route.params;

  const handleTransactionPress = (transaction) => {
    navigation.navigate('TransactionDetails', { transaction });
  };

  const handleCalculatePress = () => {
    navigation.navigate('CalculationResults', { transactions });
  };

  const renderTransaction = ({ item }) => (
    <TouchableOpacity onPress={() => handleTransactionPress(item)} style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionCreator}>Created by: {item.creator}</Text>
      </View>
      <Text style={styles.transactionAmount}>${item.amount.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.groupName}>{groupName}</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={styles.transactionList}
      />
      <TouchableOpacity style={styles.calculateButton} onPress={handleCalculatePress}>
        <Text style={styles.calculateButtonText}>Calculate</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.fab} onPress={() => console.log('Add transaction')}>
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
    color: '#2D9CDB',
    marginBottom: 20,
    textAlign: 'center',
  },
  transactionList: {
    paddingTop: 10,
  },
  transactionCard: {
    backgroundColor: '#F3F4F6',
    padding: 20,
    marginVertical: 10,
    borderRadius: 12,
    position: 'relative',
  },
  transactionHeader: {
    marginBottom: 10,
  },
  transactionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  transactionCreator: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  transactionAmount: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D9CDB',
  },
  calculateButton: {
    backgroundColor: '#2D9CDB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#2D9CDB',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
