// GroupDetails.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getDatabase, ref, onValue } from 'firebase/database';

// Sample profile pictures mapped by filename
const profilePictures = {
  "image_part_001.jpg": require('../assets/icons/image_part_001.jpg'),
  "image_part_002.jpg": require('../assets/icons/image_part_002.jpg'),
  "image_part_003.jpg": require('../assets/icons/image_part_003.jpg'),
  "image_part_004.jpg": require('../assets/icons/image_part_004.jpg'),
  "image_part_005.jpg": require('../assets/icons/image_part_005.jpg'),
  "image_part_006.jpg": require('../assets/icons/image_part_006.jpg'),
  "image_part_007.jpg": require('../assets/icons/image_part_007.jpg'),
  "image_part_008.jpg": require('../assets/icons/image_part_008.jpg'),
  "image_part_009.jpg": require('../assets/icons/image_part_009.jpg'),
};

const GroupDetails = ({ route, navigation }) => {
  const { groupName } = route.params;
  const [transactions, setTransactions] = useState([]);
  const [members, setMembers] = useState([]);
  const [profilePicturesByUser, setProfilePicturesByUser] = useState({});

  useEffect(() => {
    const db = getDatabase();
    const groupRef = ref(db, `Groups/${groupName}`);

    const fetchGroupData = () => {
      onValue(groupRef, (snapshot) => {
        const groupData = snapshot.val();
        if (groupData) {
          const authenticatedUsers = groupData.AuthenticatedUsers || [];
          const guests = groupData.Guests ? Object.values(groupData.Guests).map((guest) => guest.Name) : [];
          setMembers([...authenticatedUsers, ...guests]);
        }
      });
    };

    const fetchTransactions = () => {
      const transactionsRef = ref(db, `Groups/${groupName}/Requests`);
      onValue(transactionsRef, (snapshot) => {
        const transactionsData = snapshot.val();
        if (transactionsData) {
          const loadedTransactions = Object.entries(transactionsData).map(([id, transaction]) => ({
            id,
            ...transaction,
          }));
          setTransactions(loadedTransactions);
        }
      });
    };

    const fetchProfilePictures = () => {
      const usersRef = ref(db, 'Users');
      onValue(usersRef, (snapshot) => {
        const usersData = snapshot.val();
        const picturesMap = {};
        Object.values(usersData).forEach((user) => {
          if (user.name && user.profilePicture) {
            picturesMap[user.name] = profilePictures[user.profilePicture];
          }
        });
        setProfilePicturesByUser(picturesMap);
      });
    };

    fetchGroupData();
    fetchTransactions();
    fetchProfilePictures();
  }, [groupName]);

  const handleTransactionPress = (transaction) => {
    navigation.navigate('TransactionDetails', { transaction });
  };

  const handleCalculatePress = () => {
    navigation.navigate('CalculationResults', { transactions, groupName });
  };

  const handleAddTransaction = () => {
    navigation.navigate('AddTransaction', { groupName, members });
  };

  const renderTransaction = ({ item }) => (
    <TouchableOpacity onPress={() => handleTransactionPress(item)} style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <View style={styles.creatorContainer}>
          {profilePicturesByUser[item.creator] && (
            <Image source={profilePicturesByUser[item.creator]} style={styles.creatorPfp} />
          )}
          <Text style={styles.transactionCreator}>Created by: {item.creator}</Text>
        </View>
      </View>
      <Text style={styles.transactionAmount}>${item.amount ? item.amount.toFixed(2) : '0.00'}</Text>
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
  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorPfp: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  transactionCreator: {
    fontSize: 14,
    color: '#555',
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
