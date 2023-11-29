import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {Header} from '../../../components';
import {appIcons} from '../../../assets';
import {
  Button,
  Menu,
  Divider,
  Provider as PaperProvider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import VideoPlayer from 'react-native-video-controls'

const CreatePost = ({navigation}) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const [videoUri, setVideoUri] = useState(null);
  const [image, setImage] = useState(null);
  const [postCaption, setPostCaption] = useState('');

  const pickVideo = async () => {
    const options = {
      mediaType: 'video',
    };

    await ImagePicker.openPicker(options)
      .then(response => {
        if (response.path) {
          setVideoUri(response.path);
          console.log('res', response);
        }
      })
      .catch(error => {
        console.error('Error picking video:', error);
      });
  };

  const selectImage = async () => {
    await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(img => {
      setImage(img?.path);
    });
  };

  const handlePost = async () => {
    try {
      const user = auth().currentUser;

      if (user) {
        const userId = user.uid;
        const postRef = database().ref(`Users/${userId}/posts`);

        let imageUrl = null;
        let videoUrl = null;

        if (image) {
          imageUrl = await uploadMedia(image, 'images');
        }

        if (videoUri) {
          videoUrl = await uploadMedia(videoUri, 'videos');
        }

        postRef.push({
          caption: postCaption,
          image: imageUrl,
          video: videoUrl,
          imageUri: imageUrl ? image : null,
          videoUri: videoUrl ? videoUrl : null,
        });

        console.log('Post added successfully');
        navigation.goBack();
      } else {
        console.log('No authenticated user found');
      }
    } catch (error) {
      console.error('Error adding post: ', error);
    }
  };

  const uploadMedia = async (mediaUri, mediaType) => {
    try {
      setLoading(true);

      const response = await fetch(mediaUri);
      const blob = await response.blob();

      const storageRef = storage().ref(mediaType);
      const uniqueFileName = `${mediaType}_${Date.now()}.${mediaUri
        .split('.')
        .pop()}`;

      const mediaRef = storageRef.child(uniqueFileName);

      await mediaRef.put(blob);

      const mediaUrl = await mediaRef.getDownloadURL();
      setLoading(false);

      return mediaUrl;
    } catch (error) {
      console.error(`Error uploading ${mediaType}:`, error);
      setLoading(false);
      Alert.alert('Error', `Failed to upload ${mediaType}`);
      return null;
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Header
        lable={'Create Post'}
        leftIcon={appIcons.back}
        leftOnPress={() => {
          navigation.goBack();
        }}
      />

      <View style={styles.userDetailsContainer}>
        <View style={{width:'18%'}}>
        <Image
          resizeMode="contain"
          style={styles.userAvatar}
          source={appIcons.person}
        /></View>
        <View style={{width:'62%' , alignItems:'flex-start'}}>
          <Text style={styles.userName}>Hashim</Text>
          <PaperProvider>
            <Menu
              contentStyle={styles.menuContent}
              style={styles.menu}
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <Button style={styles.menuButton} onPress={openMenu}>
                  <Text style={styles.menuText}>Public</Text>
                  <Icon name={'chevron-down'} size={10} color="grey" />
                </Button>
              }>
              <Menu.Item
                style={styles.menuItem}
                onPress={() => {}}
                title="Friends"
              />
              <Menu.Item
                style={styles.menuItem}
                onPress={() => {}}
                title="Only Me"
              />
              <Divider />
              <Menu.Item
                style={styles.menuItem}
                onPress={() => {}}
                title="Public"
              />
            </Menu>
          </PaperProvider>
        </View>
<View style={{width:'20%',alignItems:'flex-end'}}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text
            onPress={() => {
              handlePost();
            }}
            disabled={
              postCaption.length === 0 && image === null && videoUri === null
            }
            style={styles.postButton}>
            Post
          </Text>
        )}
        </View>
      </View>

      <View style={styles.postContent}>
        <TextInput
          value={postCaption}
          onChangeText={text => setPostCaption(text)}
          multiline={true}
          placeholder="What's on your mind?"
          style={styles.captionInput}
        />
        {image ? (
          <View style={styles.imageContainer}>
            <Image
              source={{uri: image}}
              resizeMode={'contain'}
              style={styles.image}
            />
          </View>
        ) : videoUri ? (
          <VideoPlayer
          source={{uri: videoUri}}
          ref={ref => {
            this.player = ref;
          }}
          onBuffer={this.onBuffer}
          onError={this.videoError}
          style={styles.backgroundVideo}
        />
        ) :
        null}
      </View>
      <View style={styles.modal}>
        <TouchableOpacity onPress={selectImage} style={styles.button}>
          <Icon name={'image-outline'} size={20} />
          <Text style={styles.buttonText}>Photos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={pickVideo} style={styles.button}>
          <Icon name={'videocam-outline'} size={22} />
          <Text style={styles.buttonText}>Videos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreatePost;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  userDetailsContainer: {
    marginVertical: 15,
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 0.8,
    borderBottomColor: 'rgba(220,220, 220,1)',
    paddingBottom: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,

  },
  userAvatar: {
    height: 60,
    width: 60,
    marginRight: 10,
  },
  userName: {
    color: 'black',
    fontWeight: '700',
    marginTop: 5,
  },
  menu: {
    top: 30,
    left: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    zIndex: 2,
  },
  menuButton: {
    marginLeft: -12,
  },
  menuText: {
    color: 'grey',
  },
  menuContent: {
    overflow: 'visible',
  },
  menuItem: {
    backgroundColor: '#ffff',
    borderBottomWidth: 0.3,
  },
  postButton: {
    color: '#1F41BB',
    marginRight: 10,
    fontSize: 18,
    fontWeight: '700',
  },
  postContent: {
    backgroundColor: '#ffff',
    height: hp('40%'),
    width: '100%',
    borderColor: 'rgba(220,220, 220,1)',
    borderRadius: 8,
    flexGrow: 0.9,
  },
  captionInput: {
    borderColor: '#ffff',
    textAlignVertical: 'center',
    height: '10%',
  },
  modal: {
    marginTop: 40,
    width: '100%',
    flexDirection: 'row-reverse',
    height: hp('5%'),
    alignItems: 'center',
    borderBottomWidth: 0.8,
    borderBottomColor: 'rgba(220,220, 220,1)',
  },
  button: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 0.8,
    borderColor: 'rgba(220,220, 220,1)',
  },
  buttonText: {
    fontSize: 16,
    padding: 2,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '89%',
    width: '98%',
    borderWidth: 0.8,
    borderColor: 'rgba(220,220, 220,1)',
    borderRadius: 10,
    alignSelf: 'center',
  },
  image: {
    height: '90%',
    width: '100%',
  },
  backgroundVideo: {
    position: 'absolute',
    height: 400,
    width: '100%',
    top: 50,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
