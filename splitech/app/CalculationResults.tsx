// CalculationResults.js
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Button, FlatList, StyleSheet, Text, View} from 'react-native';
import {get, getDatabase, ref} from 'firebase/database';
import {encodeEmail} from './utils';

const CalculationResults = ({ route }) => {
  const { transactions, groupName } = route.params;
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const calculateTransactions = async () => {
      try {
        const db = getDatabase();
        const groupRef = ref(db, `Groups/${groupName}`);
        const groupSnapshot = await get(groupRef);

        if (!groupSnapshot.exists()) {
          throw new Error('Group data not found');
        }

        const groupData = groupSnapshot.val();
        const ownerEmail = groupData.Owner;
        const authenticatedUsers = groupData.AuthenticatedUsers || [];
        
        // Get guest names directly from the Guests structure
        const guests = groupData.Guests
          ? Object.values(groupData.Guests).reduce((acc, guest) => {
              acc[guest.Email] = guest.Name;
              return acc;
            }, {})
          : {};

        // Fetch authenticated users' names based on emails
        const emailToNameMap = {};
        for (const email of [ownerEmail, ...authenticatedUsers]) {
          const userRef = ref(db, `Users/${encodeEmail(email)}`);
          const userSnapshot = await get(userRef);
          if (userSnapshot.exists()) {
            emailToNameMap[email] = userSnapshot.val().name || email;
          }
        }

        // Merge guest names into the emailToNameMap
        const nameMap = { ...emailToNameMap, ...guests };

        // Replace emails with names in transactions, using guest names directly if available
        const transactionsWithNames = transactions.map((transaction) => ({
          ...transaction,
          creator: nameMap[transaction.creator] || transaction.creator,
          members: transaction.members.map((member) => nameMap[member] || member),
        }));

        // Prepare edges array: [creator (payer), ...members (payees), amount]
        const edges = transactionsWithNames.map((transaction) => [
          transaction.creator,
          ...transaction.members,
          transaction.amount,
        ]);

        // Collect unique names for the 'names' array
        const uniqueNames = Array.from(new Set(Object.values(nameMap)));

        // Send request to the calculation API
        const response = await fetch('https://us-central1-splitech-441301.cloudfunctions.net/splitech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ names: uniqueNames, edges }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch calculation results');
        }

        const data = await response.json();
        setResults(data.transactions || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    calculateTransactions();
  }, [transactions, groupName]);

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" color="#2D9CDB" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  const renderTransaction = ({ item }) => (
    <Text style={styles.resultText}>
      {item[1]} owes {item[0]}: ${item[2].toFixed(2)}
    </Text>
  );
  const logTransactions = async () => {
    let emails = await getGuestEmails(groupName);
    for (let i = 0; i < emails.length; i++) {
      let email = emails[i];
      let relatedTransactions = results.filter(transaction => transaction[0] === email.Name || transaction[1] === email.Name);
      if (relatedTransactions.length === 0) {
        continue;
      }
      //Send email to user
      
    }

  };
  const getGuestEmails = async (groupName) => {
    try {
      const db = getDatabase();
      const groupRef = ref(db, `Groups/${groupName}`);
      const groupSnapshot = await get(groupRef);

      if (!groupSnapshot.exists()) {
        throw new Error('Group data not found');
      }

      const groupData = groupSnapshot.val();
      const guests = groupData.Guests || {};

      const guestEmails = Object.values(guests)
          .filter(guest => guest.Email)
      return guestEmails;
    } catch (error) {
      console.error('Error fetching guest emails:', error);
      return [];
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Calculation Results</Text>
      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderTransaction}
        contentContainerStyle={styles.resultsContainer}
      />
      <Button title="Send Emails" onPress={logTransactions} />
    </View>
  );
};

export default CalculationResults;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D9CDB',
    marginBottom: 20,
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  resultsContainer: {
    paddingTop: 10,
  },
  resultText: {
    fontSize: 18,
    color: '#333',
    padding: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginVertical: 5,
    textAlign: 'center',
  },
});
