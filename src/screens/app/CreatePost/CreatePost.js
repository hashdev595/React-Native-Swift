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
import {Button, Menu, Divider, PaperProvider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

const CreatePost = ({navigation}) => {
  //React native paper for dropdown menu

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  //Image pikker

  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  console.log(image);
  const selectImage = async () => {
    await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(img => {
      setImage(img?.path);
    });
  };

  // Firebase
  const [postCaption, setPostCaption] = useState('');

  const handlePost = async () => {
    try {
      const user = auth().currentUser;

      if (user) {
        const userId = user.uid;
        const postRef = database().ref(`Users/${userId}/posts`);

        let imageUrl = null;

        if (image) {
          // Upload the image and get the download URL
          imageUrl = await uploadImage();
        }

        // Push the postCaption and imageUrl as new items in the 'posts' node
        postRef.push({
          caption: postCaption,
          image: `image_${Date.now()}.jpg`,
          imgUrl: imageUrl,
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

  const uploadImage = async () => {
    try {
      if (!image) {
        Alert.alert('Error', 'Please select an image first');
        return null;
      }
      setLoading(true);
      const response = await fetch(image);
      const blob = await response.blob();

      const storageRef = storage().ref();
      const uniqueFileName = `image_${Date.now()}.jpg`; // Unique filename
      setImageName(uniqueFileName);

      const imageRef = storageRef.child(`images/${uniqueFileName}`);

      await imageRef.put(blob);

      const imageUrl = await imageRef.getDownloadURL();
      setLoading(false);

      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to upload image');
      return null;
    }
  };

  // const [imageUrl, setImageUrl] = useState(null);

  // const loadImages = async () => {
  //   const storageRef = storage().ref(`images/${imageName}`);

  //   // Get the download URL for the image
  //   storageRef
  //     .getDownloadURL()
  //     .then(url => {
  //       // Set the image URL to the state
  //       setImageUrl(url);
  //     })
  //     .catch(error => {
  //       console.error('Error getting download URL:', error);
  //     });
  // }
  return (
    <View style={styles.mainContainer}>
      <Header
        lable={'Create Post'}
        leftIcon={appIcons.back}
        leftOnPress={() => {
          navigation.goBack();
        }}
      />
      <View
        style={{
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
        }}>
        <View
          style={{
            alignItems: 'flex-start',
            justifyContent: 'center',
            alignSelf: 'center',
            flexDirection: 'row',
            position: 'relative',
          }}>
          <Image
            resizeMode="contain"
            style={{height: 60, width: 60, marginRight: 10}}
            source={appIcons.person}
          />
          <View>
            <Text style={{color: 'black', fontWeight: '700', marginTop: 5}}>
              Hashim
            </Text>
            <PaperProvider>
              <Menu
                contentStyle={{
                  overflow: 'visible',
                }}
                style={{
                  top: 30,
                  left: 40,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: '100%',
                  zIndex: 2,
                }}
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                  <Button
                    style={{
                      marginLeft: -12,
                    }}
                    onPress={openMenu}>
                    <Text
                      style={{
                        color: 'grey',
                      }}>
                      Public
                    </Text>
                    <Icon name={'chevron-down'} size={10} color="grey" />
                  </Button>
                }>
                <Menu.Item
                  style={{backgroundColor: '#ffff', borderBottomWidth: 0.3}}
                  onPress={() => {}}
                  title="friends"
                />
                <Menu.Item
                  style={{backgroundColor: '#ffff', borderBottomWidth: 0.3}}
                  onPress={() => {}}
                  title="only me"
                />
                <Divider />
                <Menu.Item
                  style={{backgroundColor: '#ffff'}}
                  onPress={() => {}}
                  title="public"
                />
              </Menu>
            </PaperProvider>
          </View>
        </View>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text
            onPress={() => {
              handlePost();
            }}
            disabled={postCaption.length === 0 && image === null ? true : false}
            style={{
              color: '#1F41BB',
              marginRight: 10,
              fontSize: 18,
              fontWeight: '700',
            }}>
            Post
          </Text>
        )}
      </View>
      <View style={styles.postContent}>
        <TextInput
          value={postCaption}
          onChangeText={text => setPostCaption(text)}
          multiline={true}
          placeholder="What's on your mind?"
          style={{
            borderColor: '#ffff',
            textAlignVertical: 'center',
            height: '10%',
          }}
        />
        {image && (
          <View style={styles.imageContainer}>
            <Image
              source={{uri: image}}
              resizeMode={'contain'}
              style={{
                height: '90%',
                width: '100%',
              }}
            />
          </View>
        )}
      </View>
      <View style={styles.modal}>
        <TouchableOpacity onPress={selectImage} style={styles.button}>
          <Icon name={'image-outline'} size={20} />
          <Text style={styles.buttonText}>Photos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
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
  postContent: {
    backgroundColor: '#ffff',
    height: hp('40%'),
    width: '100%',
    borderColor: 'rgba(220,220, 220,1)',
    borderRadius: 8,
    flexGrow: 0.9,
  },
  modal: {
    // backgroundColor:'yellow',
    marginTop: 40,
    width: '100%',
    flexDirection: 'row-reverse',
    height: hp('5%'),
    alignItems: 'center',
    borderBottomWidth: 0.8,
    borderBottomColor: 'rgba(220,220, 220,1)',
  },
  button: {
    // backgroundColor:'green',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 0.8,
    borderColor: 'rgba(220,220, 220,1)',
  },
  buttonText: {
    // color:'black',
    fontSize: 16,
    padding: 2,
  },
  imageContainer: {
    // backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
    height: '89%',
    width: '98%',
    borderWidth: 0.8,
    borderColor: 'rgba(220,220, 220,1)',
    borderRadius: 10,
    alignSelf: 'center',
  },
});
