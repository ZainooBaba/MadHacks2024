import React, { useEffect, useState } from "react";
import Transaction from "./Transaction";
import { ref, get } from "firebase/database";
import { useParams } from "react-router-dom";
import { database } from "../firebaseConfig";

export const TransactionContainer = () => {
  const [transactions, setTransactions] = useState([]);
  const { groupName } = useParams();

  useEffect(() => {
    const fetchTransactions = async () => {
      console.log("Fetching transactions for:", groupName);
      const dbRef = ref(database, `Groups/${groupName}/Requests`);

      try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log("Raw data from Firebase:", data); // Check data here
          const formattedTransactions = Object.keys(data).map((key) => ({
            id: key,
            title: data[key].title || key,
            creator: data[key].creator || "Unknown",
            amount: data[key].amount || 0,
            description: data[key].description || "No description provided",
            members: data[key].members || [],
          }));
          console.log("Formatted transactions:", formattedTransactions); // Check formatted data
          setTransactions(formattedTransactions);
        } else {
          console.log("No transactions found for group:", groupName);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [groupName]);

  return (
    <div className="flex flex-col items-center justify-center m-4 w-full mt-5 space-y-3">
      {transactions.map((transaction) => (
        <Transaction
          key={transaction.id}
          title={transaction.title}
          creator={transaction.creator}
          amount={transaction.amount}
          description={transaction.description}
          members={transaction.members}
        />
      ))}
    </div>
  );
};
