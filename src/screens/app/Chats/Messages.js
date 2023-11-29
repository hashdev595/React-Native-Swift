import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const Messages = ({ route }) => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const chatRoomId = route.params?.chatRoomId;
  const chatRoomName = route.params?.chatRoomName;

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged((authenticatedUser) => {
      setUser(authenticatedUser);
    });

    const chatRoomRef = database().ref(`chatRooms/${chatRoomId}/messages`);

    const unsubscribeMessages = chatRoomRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesArray = Object.keys(data).map((key) => ({
          ...data[key],
          _id: key, // Assigning a unique ID to each message
        }));
        setMessages(messagesArray);
      }
    });

    return () => {
      unsubscribeAuth();
      chatRoomRef.off('value', unsubscribeMessages);
    };
  }, [chatRoomId]);

  const onSend = async (newMessages = []) => {
    const formattedMessages = newMessages.map((message) => ({
      ...message,
      createdAt: message.createdAt.getTime(), // Convert createdAt to timestamp
    }));

    await database().ref(`chatRooms/${chatRoomId}/messages`).push(formattedMessages[0]);
  };

  return (
    <View style={{ flex: 1 }}>
      <Text>Welcome, {user ? user.email : 'Guest'}</Text>
      <Text>Chat Room: {chatRoomName}</Text>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: user ? user.uid : 0, // Use 0 as a temporary user ID for guest
        }}
      />
    </View>
  );
};

export default Messages;