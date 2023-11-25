import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {FeedCards, Header} from '../../../components';
import {appIcons, appImages} from '../../../assets';
import database from '@react-native-firebase/database';
import {useNavigation} from '@react-navigation/native';

// const data = [
//   {
//     id: 0,
//     name: 'Hashim',
//     location: 'Lahore',
//     img: appIcons.person,
//     postImg: appImages.binance,
//     content: `Binance Expands Account Statement Function. With our VIP and institutional clients in mind, we’ve upgraded the account statement function...`,
//   },
//   {
//     id: 1,
//     name: 'Hashim',
//     location: 'Lahore',
//     img: appIcons.person,
//     postImg: appImages.binance,
//     content: `Binance Expands Account Statement Function. With our VIP and institutional clients in mind, we’ve upgraded the account statement function...`,
//   },
//   {
//     id: 2,
//     name: 'Hashim',
//     location: 'Lahore',
//     img: appIcons.person,
//     postImg: appImages.binance,
//     content: `Binance Expands Account Statement Function. With our VIP and institutional clients in mind, we’ve upgraded the account statement function...`,
//   },
//   {
//     id: 3,
//     name: 'Hashim',
//     location: 'Lahore',
//     img: appIcons.person,
//     postImg: appImages.binance,
//     content: `Binance Expands Account Statement Function. With our VIP and institutional clients in mind, we’ve upgraded the account statement function...`,
//   },
//   {
//     id: 4,
//     name: 'Hashim',
//     location: 'Lahore',
//     img: appIcons.person,
//     postImg: appImages.binance,
//     content: `Binance Expands Account Statement Function. With our VIP and institutional clients in mind, we’ve upgraded the account statement function...`,
//   },
// ];

const Feeds = () => {
  const navigation = useNavigation();
  const [likedPosts, setLikedPosts] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [captions, setCaptions] = useState([])
  // const [image, setImage] = useState([])
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

        // Add the promise to the array
        promises.push(
          userPostsRef.once('value', snapshots =>
            console.log('snapshots', snapshots),
          ),
        );
      });

      // Wait for all promises to resolve
      const snapshots = await Promise.all(promises);

      const allPosts = [];

      // Iterate through each user's posts
      snapshots.forEach(userPostsSnapshot => {
        userPostsSnapshot.forEach(postSnapshot => {
          const post = postSnapshot.val();
          allPosts.push(post);
        });
      });
      setLoading(false);
      setAppPosts(allPosts);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  console.log('image', appPosts);
  // console.log('caption', captions)
  useEffect(() => {
    const sub = navigation.addListener(() => 'focus', fetchAllUserPosts());
    sub();
  }, [navigation]); // The empty dependency array ensures that this effect runs once when the component mounts

  console.log('appPosts:', appPosts);

  console.log('liked:', likedPosts);
  console.log('follow:', followedUsers);
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
        keyExtractor={item => item.postId}
        pagingEnabled={false}
        snapToInterval={postHeight}
        decelerationRate="fast"
        renderItem={({item}) => (
          <FeedCards
            style={{
              height: 25,
              width: 27,
              tintColor: likedPosts.includes(item.id) ? 'red' : 'black',
            }}
            likePress={() => handleLikePress(item.id)}
            content={item.caption ? item.caption : 'none'}
            location={item.location ? item.location : 'Lahore'}
            name={item.name ? item.name : 'Hashim'}
            postImg={item.imgUrl}
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
        )}
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
