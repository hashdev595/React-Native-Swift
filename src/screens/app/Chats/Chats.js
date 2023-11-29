import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../../../components';

const Chats = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged((authenticatedUser) => {
      setUser(authenticatedUser);
    });

    const chatsRef = database().ref(`Users/${user?.uid}/chats`);

    const unsubscribeChats = chatsRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const chatsArray = Object.keys(data).map((key) => data[key]);
        setChats(chatsArray);
      }
    });

    return () => {
      unsubscribeAuth();
      chatsRef.off('value', unsubscribeChats);
    };
  }, [user]);

  const navigateToMessages = (chatRoomId, chatRoomName) => {
    navigation.navigate('Messages', { chatRoomId, chatRoomName });
  };
  return (
    <View style={{flex:1, height:'90%'}}>
      <Header lable={'Chats'}/>
      <Text>Welcome, {user ? user.email : 'Guest'}, chat screen</Text>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.chatRoomId}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToMessages(item.chatRoomId, item.chatRoomName)}>
            <Text>{item.chatRoomName}</Text>
          </TouchableOpacity>
        )}
      />
       <TouchableOpacity
        onPress={() => {
          navigation.navigate('App', {screen: 'Contacts'});
        }}
        style={{
          right: 20,
          bottom: 20,
          position: 'absolute',
          backgroundColor: '#1F41BB',
          borderRadius: 60,
          alignItems: 'center',
          height: 60,
          width: 60,
          justifyContent: 'center',
          elevation: 1,
        }}>
        <Text
          style={{
            fontSize: 40,
            color: 'white',
            textAlign: 'center',
            textAlignVertical: 'center',
            padding: 0,
          }}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Chats;