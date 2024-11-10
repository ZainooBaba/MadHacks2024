import React, { useState, useRef } from 'react';
import { Text, View, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Keyboard, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {get, getDatabase, push, ref, set} from "firebase/database";
import {encodeEmail} from "@/app/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CreateGroup({navigation}) {
    const [groupName, setGroupName] = useState('New Group');
    const [members, setMembers] = useState([
        { name: 'John Doe', email: 'john@gmail.com' },
        { name: 'Jane Doe' },
        { name: 'John Smith', email: 'smith@gmail.com' },
        { name: 'Jane Smith' }
    ]);
    const [memberName, setMemberName] = useState('');
    const [memberEmail, setMemberEmail] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const groupNameRef = useRef(null);

    const addMember = () => {
        if (memberName) {
            const newMember = { name: memberName };
            if (memberEmail) newMember.email = memberEmail;
            setMembers([...members, newMember]);
            setMemberName('');
            setMemberEmail('');
        }
    };
    const dbAdd = async () => {
        const db = getDatabase();
        const guests = {};

        for (const member of members) {
            const newRef = push(ref(db, 'Groups/Guests'));
            const guestId = newRef.key;
            guests[guestId] = {
                Name: member.name
            };
            if (member.email) {
                guests[guestId].Email = member.email;
            }
        }

        const email = await AsyncStorage.getItem('email');
        if (!email) {
            console.error('No email found in AsyncStorage');
            return;
        }

        const encodedEmail = encodeEmail(email);
        const userRef = ref(db, `Users/${encodedEmail}/Groups`);
        const userSnapshot = await get(userRef);
        let userGroups = [];

        if (userSnapshot.exists()) {
            userGroups = userSnapshot.val();
        }

        userGroups.push(groupName);

        await Promise.all([
            set(userRef, userGroups),
            set(ref(db, `Groups/${groupName}`), {
                Owner: encodedEmail,
                Guests: guests
            })
        ]);
        navigation.replace('Dashboard'); // Replace 'DesiredScreen' with your target screen
    };

    const handleSubmit = () => {
        console.log({ groupName, members });
    };

    const handleFocus = (ref, text) => {
        setIsFocused(true);
        ref.current && ref.current.focus();
        ref.current && ref.current.setNativeProps({ selection: { start: 0, end: text.length } });
    };

    const handleBlur = () => {
        if (!groupName) setGroupName('New Group');
        setIsFocused(false);
    };

    const MemberCard = ({ name, email = '', onAddEmail }) => {
        const [currentEmail, setCurrentEmail] = useState(email);
        const emailInputRef = useRef(null);
    
        const handleEmailSubmit = () => {
            setMembers((prevMembers) =>
                prevMembers.map((member) =>
                    member.name === name ? { ...member, email: currentEmail } : member
                )
            );
        };
    
        return (
            <View style={styles.memberCard}>
                <View>
                    <Text style={styles.memberCardName}>{name}</Text>
                    
                    <TextInput
                        ref={emailInputRef}
                        style={styles.memberCardEmail}
                        value={currentEmail}
                        onChangeText={setCurrentEmail}
                        onFocus={() => onAddEmail && onAddEmail(emailInputRef)}
                        onSubmitEditing={handleEmailSubmit}
                    />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {!email && (
                        <Pressable style={styles.addEmail} onPress={() => onAddEmail(emailInputRef)}>
                            <Text style={styles.addEmail2}>Add Email</Text>
                        </Pressable>
                    )}
                    <Pressable onPress={() => setMembers(members.filter(member => member.name !== name))}>
                        <Icon name="trash" size={20} color="red" />
                    </Pressable>
                </View>
            </View>
        );
    };
    

    return (
        <View style={styles.container}>
            <View>
                <TextInput
                    ref={groupNameRef}
                    value={groupName}
                    onChangeText={setGroupName}
                    style={[styles.title, isFocused ? styles.inputFocused : null]}
                    onFocus={() => handleFocus(groupNameRef, groupName)}
                    onBlur={handleBlur}
                />
                <Icon name="pencil" size={20} style={styles.icon} />
            </View>
            <Text style={styles.subtitle}>Add New Member</Text>
            <TextInput
                placeholder="Member Name"
                value={memberName}
                onChangeText={setMemberName}
                style={styles.input}
            />
            <TouchableOpacity onPress={addMember} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Member</Text>
            </TouchableOpacity>
            <Text style={styles.subtitle}>Current Members</Text>
            <View style={styles.membersListContainer}>
                <FlatList
                    data={members}
                    keyExtractor={(item, index) => index.toString()}
                    style={{ flex: 1 }}
                    renderItem={({ item }) => (
                        <MemberCard
                            {...item}
                            onAddEmail={(inputRef) => inputRef.current && inputRef.current.focus()}
                        />
                    )}
                />
            </View>
            <TouchableOpacity onPress={dbAdd} style={styles.addButton2}>
                <Text style={styles.addButtonText}>Submit Group</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        borderColor: '#eee',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
    },
    inputFocused: {
        borderColor: '#555',
    },
    subtitle: {
        fontSize: 19,
        marginVertical: 10,
        fontWeight: 'bold',
    },
    input: {
        borderColor: '#aaa',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    addButton2: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 15,
        alignItems: 'center',
        // marginBottom: 20,
        paddingVertical:25
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    membersListContainer: {
        maxHeight: 330,
        minHeight: 330,
        marginBottom: 20,
    },
    memberCard: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    memberCardName: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    memberCardEmail: {
        paddingVertical: 3,
        color: '#555',
    },
    icon: {
        position: 'absolute',
        right: 12,
        top: 15,
        color: '#555',
    },
    addEmail: {
        padding: 5,
        borderRadius: 15,
        backgroundColor: '#e5e5e5',
        marginRight: 10,
    },
    addEmail2: {
        color: '#8E98A8',
    },
    submit: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#dddddd',
        color: 'white',
        fontWeight: 'bold',
    },
});
