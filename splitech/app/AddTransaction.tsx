import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, FlatList } from 'react-native';
import { getDatabase, ref, push } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddTransaction = ({ route, navigation }) => {
  const { groupName, members } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  const handleMemberToggle = (member) => {
    setSelectedMembers((prev) => {
      if (prev.includes(member)) {
        return prev.filter((m) => m !== member);
      } else {
        return [...prev, member];
      }
    });
  };

  const handleSaveTransaction = async () => {
    if (!title || !description || !amount || selectedMembers.length === 0) {
      Alert.alert('Incomplete Details', 'Please complete all fields and select at least one member.');
      return;
    }

    try {
      const db = getDatabase();
      const transactionRef = ref(db, `Groups/${groupName}/Requests`);
      await push(transactionRef, {
        title,
        description,
        amount: parseFloat(amount),
        members: selectedMembers,
        creator: await AsyncStorage.getItem('name')
      });
      Alert.alert('Success', 'Transaction added successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving transaction:', error);
      Alert.alert('Error', 'Failed to add transaction. Please try again.');
    }
  };

  const renderMember = ({ item }) => (
    <TouchableOpacity onPress={() => handleMemberToggle(item)} style={styles.memberContainer}>
      <View style={[styles.checkbox, selectedMembers.includes(item) && styles.checkboxSelected]} />
      <Text style={styles.memberName}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Transaction</Text>

      <TextInput
        style={styles.input}
        placeholder="Transaction Name"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.subHeader}>Select Members</Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item}
        renderItem={renderMember}
      />

      <TouchableOpacity style={styles.button} onPress={handleSaveTransaction}>
        <Text style={styles.buttonText}>Save Transaction</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddTransaction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D9CDB',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  memberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#aaa',
    marginRight: 10,
  },
  checkboxSelected: {
    backgroundColor: '#2D9CDB',
    borderColor: '#2D9CDB',
  },
  memberName: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#2D9CDB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
