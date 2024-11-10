import React, { useEffect, useState } from "react";
import Transaction from "./Transaction";
import { ref, get } from "firebase/database";
import { useParams } from "react-router-dom";
import { database } from "../firebaseConfig";

export const TransactionContainer = () => {
  const [transactions, setTransactions] = useState([]);
  const [emailToNameMap, setEmailToNameMap] = useState({});
  const [calculationResults, setCalculationResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { groupName } = useParams();

  useEffect(() => {
    const fetchGroupData = async () => {
      console.log("Fetching transactions and names for group:", groupName);
      const db = database;
      const dbRef = ref(db, `Groups/${groupName}`);
      const transactionsRef = ref(db, `Groups/${groupName}/Requests`);

      try {
        const groupSnapshot = await get(dbRef);
        const transactionsSnapshot = await get(transactionsRef);

        if (groupSnapshot.exists()) {
          const groupData = groupSnapshot.val();
          const ownerEmail = groupData.Owner;
          const authenticatedUsers = groupData.AuthenticatedUsers || [];
          
          // Retrieve guest names directly from the group data
          const guests = groupData.Guests
            ? Object.values(groupData.Guests).reduce((acc, guest) => {
                acc[guest.Email] = guest.Name;
                return acc;
              }, {})
            : {};

          // Fetch authenticated user names
          const emailToName = {};
          for (const email of [ownerEmail, ...authenticatedUsers]) {
            const userRef = ref(db, `Users/${email.replace(/[.#$[\]]/g, ",")}`);
            const userSnapshot = await get(userRef);
            if (userSnapshot.exists()) {
              emailToName[email] = userSnapshot.val().name || email;
            }
          }

          // Combine guests and authenticated users
          setEmailToNameMap({ ...emailToName, ...guests });
        }

        if (transactionsSnapshot.exists()) {
          const transactionData = transactionsSnapshot.val();
          const formattedTransactions = Object.keys(transactionData).map((key) => ({
            id: key,
            title: transactionData[key].title || key,
            creator: transactionData[key].creator,
            amount: transactionData[key].amount || 0,
            description: transactionData[key].description || "No description provided",
            members: transactionData[key].members || [],
          }));
          setTransactions(formattedTransactions);
        } else {
          console.log("No transactions found for group:", groupName);
        }
      } catch (error) {
        console.error("Error fetching transactions or names:", error);
      }
    };

    fetchGroupData();
  }, [groupName]);

  const handleCalculateResults = async () => {
    setLoading(true);

    try {
      // Map email addresses to names in transactions
      const transactionsWithNames = transactions.map((transaction) => ({
        ...transaction,
        creator: emailToNameMap[transaction.creator] || transaction.creator,
        members: transaction.members.map((member) => emailToNameMap[member] || member),
      }));

      // Prepare API payload with unique names and edges
      const names = Array.from(
        new Set(transactionsWithNames.flatMap((transaction) => [transaction.creator, ...transaction.members]))
      );

      const edges = transactionsWithNames.map((transaction) => [
        transaction.creator,
        ...transaction.members,
        transaction.amount,
      ]);

      // Send request to the calculation API
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

      const resultData = await response.json();
      setCalculationResults(resultData.transactions || []);
    } catch (error) {
      console.error("Error calculating results:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center m-4 w-full mt-5 space-y-3">
      <h2 className="text-2xl font-bold mb-4">Transactions for {groupName}</h2>
      
      {/* Transaction List */}
      {transactions.map((transaction) => (
        <Transaction
          key={transaction.id}
          title={transaction.title}
          creator={emailToNameMap[transaction.creator] || transaction.creator}
          amount={transaction.amount}
          description={transaction.description}
          members={transaction.members.map((member) => emailToNameMap[member] || member)}
        />
      ))}

      {/* Calculate Button */}
      <button
        onClick={handleCalculateResults}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={loading}
      >
        {loading ? "Calculating..." : "Calculate"}
      </button>

      {/* Calculation Results */}
      {calculationResults.length > 0 && (
        <div className="mt-6 w-full p-4 bg-gray-100 rounded">
          <h3 className="text-xl font-semibold mb-3">Calculation Results</h3>
          <ul>
            {calculationResults.map((result, index) => (
              <li key={index} className="mb-2">
                <span className="font-bold">{result[1]}</span> owes{" "}
                <span className="font-bold">{result[0]}</span>: ${result[2].toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
