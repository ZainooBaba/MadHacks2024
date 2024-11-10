import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { getNameByEmail } from './utils';

const TransactionDetails = ({ route }) => {
  const { transaction } = route.params;
  const [resolvedMembers, setResolvedMembers] = useState([]);
  const [resolvedCreator, setResolvedCreator] = useState(transaction.creator);

  // Fetch names for all members and the creator
  useEffect(() => {
    const fetchMemberNames = async () => {
      const membersWithNames = await Promise.all(
        transaction.members.map(async (member) => {
          if (member.includes('@')) {
            const name = await getNameByEmail(member);
            return name || member; // Fallback to email if no name found
          }
          return member;
        })
      );
      setResolvedMembers(membersWithNames);
    };

    const fetchCreatorName = async () => {
      if (transaction.creator.includes('@')) {
        const creatorName = await getNameByEmail(transaction.creator);
        setResolvedCreator(creatorName || transaction.creator); // Fallback to email if no name found
      }
    };

    fetchMemberNames();
    fetchCreatorName();
  }, [transaction.members, transaction.creator]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{transaction.title}</Text>
      <Text style={styles.amount}>
        Amount: <Text style={styles.amountValue}>${transaction.amount.toFixed(2)}</Text>
      </Text>
      <Text style={styles.amount}>
        Created by: <Text style={styles.amountValue}>{resolvedCreator}</Text>
      </Text>
      <Text style={styles.descriptionTitle}>Description</Text>
      <Text style={styles.description}>{transaction.description}</Text>
      <Text style={styles.membersTitle}>Bought With...</Text>
      <FlatList
        data={resolvedMembers}
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
    color: '#2D9CDB',
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
    color: '#F4A442',
    fontWeight: 'bold',
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D9CDB',
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
