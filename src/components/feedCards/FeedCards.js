import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {appIcons, appImages} from '../../assets';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import VideoPlayer from 'react-native-video-controls'

const FeedCards = ({
  profileImg,
  name,
  location,
  content,
  likePress,
  style,
  followPress,
  followStyle,
  flwTextStyle,
  flwText,
  image,
  video,
}) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardContent}>
        <View style={styles.contentHeader}>
          <Image
            style={{height: 40, width: 40, marginRight: 10}}
            source={profileImg}
          />
          <View>
            <Text style={{color: 'black', fontWeight: '700'}}>{name}</Text>
            <Text style={{color: '#1F41BB'}}>{location}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={followPress}
            style={[styles.followButton, followStyle]}>
            <Text style={flwTextStyle}>{flwText}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {content &&
        <Text style={{color: 'black', marginVertical: 10}}>{content}</Text>}
      <View style={styles.imageContainer}>
        {image && (
          <Image
            resizeMode="contain"
            style={{width: wp('90%'), height: hp('40%'), marginBottom: 15}}
            source={{uri: image}}
          />
        )}
      </View>
      
        {video && (
          <View style={styles.videoContainer}>
          <VideoPlayer
            source={{uri: video}}
            ref={ref => {
              this.player = ref;
            }}
            onBuffer={this.onBuffer}
            onError={this.videoError}
            style={styles.backgroundVideo}
          />
           </View>
        )}
     
      <View style={styles.responseContainer}>
        <View
          style={{
            width: '40%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 30,
          }}>
          <TouchableOpacity onPress={likePress}>
            <Image style={style} source={appIcons.heart} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image style={{height: 25, width: 26}} source={appIcons.comment} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image style={{height: 25, width: 25}} source={appIcons.share} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: '60%',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <Image style={{height: 25, width: 25}} source={appIcons.plus} />
        </View>
      </View>
    </View>
  );
};

export {FeedCards};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentHeader: {
    flexDirection: 'row',
  },
  imageContainer: {
    maxHeight: hp('70%'),
    width: wp('90%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  responseContainer: {
    flexDirection: 'row',
  },
  followButton: {
    backgroundColor: '#1F41BB',
    borderRadius: 6,
    padding: 4,
  },
  videoContainer: {
    height: hp('40%'),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical:10
  },
  backgroundVideo:{
  }
});
