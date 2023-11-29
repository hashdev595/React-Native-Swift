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
        const usersArray = Object.keys(data).map(key => data[key]);
        setUsers(usersArray);
      }
    });

    return () => {
      unsubscribeAuth();
      usersRef.off('value', unsubscribeUsers);
    };
  }, []);

  const startChat = async (userId, username) => {
    const currentUser = auth().currentUser;
    const chatRoomsRef = database().ref('chatRooms');
    const existingChatSnapshot = await chatRoomsRef
      .orderByChild(`users/${currentUser.uid}`)
      .equalTo(true)
      .once('value');
  
    const existingChat = existingChatSnapshot.val();
  
    if (existingChat) {
      // If a chat room already exists, navigate to it
      const chatRoomId = Object.keys(existingChat)[0];
      navigation.navigate('Chats', { chatRoomId });
    } else {
      // If no chat room exists, create a new one
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
        chatRoomName: username, // Use the other user's name as the room name for simplicity
      });
  
      // Update other user's chat list
      database().ref(`Users/${userId}/chats/${chatRoomId}`).set({
        chatRoomId,
        chatRoomName: currentUser.email, // Use current user's email as the room name for simplicity
      });
  
      navigation.navigate('Chats', { chatRoomId });
    }
  };

  return (
    <View>
      <Text>Welcome, {user ? user.email : 'Guest'}</Text>
      <FlatList
        data={users}
        keyExtractor={item => item.userId}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => startChat(item.userId, item.username)}>
            <Text>{item.username}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Contacts;
