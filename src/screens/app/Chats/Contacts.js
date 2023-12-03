import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const Contacts = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged(authenticatedUser => {
      setUser(authenticatedUser);
    });

    const usersRef = database().ref('Users');

    const unsubscribeUsers = usersRef.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        const usersArray = Object.keys(data).map(key => data[key])
        .filter(user => user.userUid !== auth().currentUser.uid);
        setUsers(usersArray);
      }
    });
    console.log('users',users);
    return () => {
      unsubscribeAuth();
      usersRef.off('value', unsubscribeUsers);
    };
  }, []);

  const startChat = async (userId, username) => {
    const currentUser = auth().currentUser;
    const chatRoomsRef = database().ref('chatRooms');
  
    // Check for existing chat rooms where the current user is a participant
    const existingChatsSnapshot = await chatRoomsRef
      .orderByChild(`Users/${currentUser.uid}`)
      .equalTo(true)
      .once('value');
  
    const existingChats = existingChatsSnapshot.val();
  
    if (existingChats) {
      // Filter out chat rooms where the other participant is the selected user
      const filteredChats = Object.keys(existingChats).filter(chatRoomId => {
        const participants = existingChats[chatRoomId].Users;
        return participants && participants[userId];
      });
  
      if (filteredChats.length > 0) {
        // If a chat room already exists, navigate to the first one found
        const chatRoomId = filteredChats[0];
        navigation.navigate('Chats', { chatRoomId });
        return;
      }
    }
  
    // If no existing chat room is found, create a new one
    const newChatRoomRef = chatRoomsRef.push();
    const chatRoomId = newChatRoomRef.key;
  
    // Add the users to the chat room
    newChatRoomRef.child('Users').set({
      [currentUser.uid]: true,
      [userId]: true,
    });
  
    // Create a 'messages' node in the chat room
    newChatRoomRef.child('messages').set({});
  
    // Update user's chat list
    database().ref(`Users/${currentUser.uid}/chats/${chatRoomId}`).set({
      chatRoomId,
      chatRoomName: username, // Use the other user's name as the room name
    });
  
    // Update other user's chat list
    database().ref(`Users/${userId}/chats/${chatRoomId}`).set({
      chatRoomId,
      chatRoomName: currentUser.email, // Use current user's email as the room name 
    });
  
    navigation.navigate('Chats', { chatRoomId });
  };

  return (
    <View style={{marginTop:100}}>
      <Text>Welcome, {user ? user.email : 'Guest'}</Text>
      <FlatList
        data={users}
        keyExtractor={item => item.userUid}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => startChat(item.userUid, item.name)}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Contacts;
