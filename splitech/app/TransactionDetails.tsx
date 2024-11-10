// TransactionDetails.js
import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

const TransactionDetails = ({ route }) => {
  const { transaction } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{transaction.title}</Text>
      <Text style={styles.amount}>Amount: <Text style={styles.amountValue}>${transaction.amount.toFixed(2)}</Text></Text>
      <Text style={styles.amount}>Created by: <Text style={styles.amountValue}>{transaction.creator}</Text></Text>
      <Text style={styles.descriptionTitle}>Description</Text>
      <Text style={styles.description}>{transaction.description}</Text>
      <Text style={styles.membersTitle}>Members Involved</Text>
      <FlatList
        data={transaction.members}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.member}>{item}</Text>}
        contentContainerStyle={styles.membersList}
      />
    </View>
  );
};

export default TransactionDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D9CDB', // Blue color for the title to match the color scheme
    marginBottom: 15,
    textAlign: 'center',
  },
  amount: {
    fontSize: 20,
    color: '#111827',
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  amountValue: {
    color: '#F4A442', // Gold color for the amount to emphasize
    fontWeight: 'bold',
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D9CDB', // Blue color for subtitle headers
    marginTop: 20,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  membersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D9CDB',
    marginBottom: 8,
  },
  membersList: {
    paddingVertical: 10,
  },
  member: {
    fontSize: 16,
    color: '#333',
    padding: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginBottom: 10,
    textAlign: 'center',
  },
});
