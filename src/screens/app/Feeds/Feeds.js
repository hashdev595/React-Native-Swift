import database from '@react-native-firebase/database';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {appIcons} from '../../../assets';
import {FeedCards, Header} from '../../../components';

const Feeds = () => {
  const navigation = useNavigation();
  const [likedPosts, setLikedPosts] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appPosts, setAppPosts] = useState([]);

  const fetchAllUserPosts = async () => {
    setLoading(true);
    try {
      const usersRef = database().ref('/Users');

      // Fetch data from the database
      const usersSnapshot = await usersRef.once('value');
      const promises = [];

      // Iterate through each user
      usersSnapshot.forEach(userSnapshot => {
        const userUid = userSnapshot.key; // User ID
        const userPostsRef = database().ref(`/Users/${userUid}/posts`);
        const userNameRef = database().ref(`/Users/${userUid}/name`);

        // Add the promises to the array
        promises.push(userPostsRef.once('value'), userNameRef.once('value'));
      });

      // Wait for all promises to resolve
      const snapshots = await Promise.all(promises);
      console.log('snap', snapshots);
      const allPosts = [];

      // Iterate through each user's data
      for (let i = 0; i < snapshots.length; i += 2) {
        const userPostsSnapshot = snapshots[i];
        const userNameSnapshot = snapshots[i + 1];

        const userName = userNameSnapshot.val();
        userPostsSnapshot.forEach(postSnapshot => {
          const post = postSnapshot.val();
          // Add the user name to the post object
          post.userName = userName;
          allPosts.push(post);
        });
      }

      setAppPosts(allPosts);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      return navigation.addListener('focus', fetchAllUserPosts);
    }
  }, [navigation]);

  const postHeight = 340;

  const handleLikePress = postId => {
    // Check if the post is already liked
    const isLiked = likedPosts.includes(postId);

    // Update likedPosts state based on whether the post is liked or unliked
    if (isLiked) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  };

  const handleFollowPress = postId => {
    // Check if the post is already liked
    const isFollowed = followedUsers.includes(postId);

    // Update likedPosts state based on whether the post is liked or unliked
    if (isFollowed) {
      setFollowedUsers(followedUsers.filter(id => id !== postId));
    } else {
      setFollowedUsers([...followedUsers, postId]);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Header
        rightIcon2={appIcons.notification}
        rightIcon={appIcons.filter}
        leftIcon={appIcons.search}
        label={'Feeds'}
      />
      <FlatList
        refreshControl={
          <RefreshControl onRefresh={fetchAllUserPosts} refreshing={loading} />
        }
        data={appPosts}
        keyExtractor={item => item.id}
        pagingEnabled={false}
        snapToInterval={postHeight}
        decelerationRate="fast"
        renderItem={({item}) => {
          console.log('item', item?.video);
          return (
            <FeedCards
              style={{
                height: 25,
                width: 27,
                tintColor: likedPosts.includes(item.id) ? 'red' : 'black',
              }}
              likePress={() => handleLikePress()}
              video={item?.video}
              content={item.caption ? item.caption : null}
              location={item.location ? item.location : 'Lahore'}
              name={item.userName}
              image={item.imgUrl}
              profileImg={item.img ? item.img : appIcons.person}
              flwText={followedUsers.includes(item.id) ? 'Follow' : 'Following'}
              flwTextStyle={{
                fontSize: 12,
                color: followedUsers.includes(item.id) ? '#ffff' : 'black',
              }}
              followStyle={{
                backgroundColor: followedUsers.includes(item.id)
                  ? '#1F41BB'
                  : '#ffff',
                borderWidth: followedUsers.includes(item.id) ? 0 : 1,
                borderColor: '#1F41BB',
                overflow: 'hidden',
              }}
              followPress={() => handleFollowPress(item.id)}
            />
          );
        }}
      />
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('App', {screen: 'CreatePost'});
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

export default Feeds;
const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'white',
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
});
