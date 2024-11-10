import React, { useState, useRef } from 'react';
import { Text, View, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Keyboard, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function CreateGroup() {
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
            <Button title="Submit Group" onPress={handleSubmit} />
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
        fontSize: 18,
        marginVertical: 10,
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
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    membersListContainer: {
        maxHeight: 350,
        minHeight: 350,
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
});
