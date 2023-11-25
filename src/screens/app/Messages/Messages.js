import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';

const PostList = () => {
  const data = [
    { id: 1, text: 'Post 1' },
    { id: 2, text: 'Post 2' },
    { id: 3, text: 'Post 3' },
    { id: 4, text: 'Post 4' },
    { id: 5, text: 'Post 5' },
    { id: 6, text: 'Post 6' },
    { id: 7, text: 'Post 7' },
    { id: 8, text: 'Post 8' },
    { id: 9, text: 'Post 9' },
    // Add more posts as needed
  ];

  const postHeight = 500; // Adjust the height as needed

  return (
    <View style={{ flex: 1, backgroundColor: 'red' }}>
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        data={data}
        renderItem={({ item }) => (
          <View style={[styles.postContainer, { height: postHeight }]}>
            <Text style={styles.postText}>{item.text}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        pagingEnabled={false}
        snapToInterval={postHeight}
        decelerationRate="fast"
      />
    </View>
  );
};

export default PostList;

const styles = StyleSheet.create({
  postContainer: {
    width: '100%', // Adjust the width as needed
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0', // Adjust the background color as needed
    borderWidth: 1,
    borderColor: '#ccc',
  },
  postText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});