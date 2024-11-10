// CalculationResults.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList } from 'react-native';

const CalculationResults = ({ route }) => {
  const { transactions } = route.params;
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const calculateTransactions = async () => {
      try {
        const names = Array.from(new Set(transactions.flatMap((t) => t.members)));
        const edges = transactions.map((t) => [...t.members, t.amount]);
        console.log(names);
        console.log(edges);
        const response = await fetch('https://us-central1-splitech-441301.cloudfunctions.net/splitech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ names, edges }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch calculation results');
        }

        const data = await response.json();
        console.log(data);
        setResults(data.transactions || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    calculateTransactions();
  }, [transactions]);

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" color="#2D9CDB" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  const renderTransaction = ({ item }) => (
    <Text style={styles.resultText}>
      {item[0]} owes {item[1]}: ${item[2].toFixed(2)}
    </Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Calculation Results</Text>
      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderTransaction}
        contentContainerStyle={styles.resultsContainer}
      />
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
