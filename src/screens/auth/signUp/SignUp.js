import React, {useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {AppInput, Background} from '../../../components';
import {AppButton} from '../../../components/appButton/AppButton';
import {appIcons} from '../../../assets';
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'

const SignUp = ({navigation}) => {

  //states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false);
  const [errMessage, seterrMessage] = useState('');
  

  //firebase
  const handleSignup = async () => {
    if (!email || !password || !name) {
      seterrMessage('enter email and password');
    } else {
      setLoading(true);
      
      try {
        await auth().createUserWithEmailAndPassword(email, password)
          .then(userCredential => {
            const user = userCredential.user;
            const userRef = database().ref('Users');

            const userUid = user.uid;

            userRef.child(user.uid).set({
              name,
              email,
              userUid,
            });

            const userKey = database().ref('User').child(user.uid).key;
            console.log('userKey', userKey);
            // Clear input fields
            setEmail('');
            setPassword('');
            setName('');
            setLoading(false);
            navigation.navigate('Login');
          });
      } catch (error) {
        console.log(error.message);
        setLoading(false);
        seterrMessage(error.message);
      }
    }
  };
  return (
    <Background>
      <View style={styles.mainContainer}>
        <View style={styles.textContainer}>
          <Text style={[styles.textHeader, {marginTop: hp('10%')}]}>
            Create Account
          </Text>
          <Text
            style={[
              styles.plainText,
              {textAlign: 'center', marginTop: hp('7%')},
            ]}>
            Create an account so you can explore all the existing jobs
          </Text>
        </View>
        <View>
          <AppInput onChangeText={text => setName(text)} value={name} placeholder={'Name'} />
          <AppInput onChangeText={text => setEmail(text)} value={email} placeholder={'Email'} />
          <AppInput onChangeText={text => setPassword(text)} value={password} secureTextEntry={true} placeholder={'Password'} />
        </View>
        <Text style={{color:'red'}}>{errMessage}</Text>
        <View style={[styles.buttonStyle, {marginVertical: 30}]}>
          <AppButton
            onPress={handleSignup}
            lable={'Sign Up'}
          />
          <Text onPress={()=>{navigation.navigate('Login')}}
            style={{textAlign: 'center', marginVertical: 30, color: 'black'}}>
            Already have an account?
          </Text>
        </View>
        <Text style={{textAlign: 'center', marginTop: 30, color: '#1F41BB'}}>
          or continue with
        </Text>
        <View style={styles.iconsContainer}>
          <Image
            resizeMode="cover"
            style={styles.imageIcon}
            source={appIcons.google}
          />
          <Image
            resizeMode="cover"
            style={styles.imageIcon}
            source={appIcons.facebook}
          />
          <Image
            resizeMode="cover"
            style={styles.imageIcon}
            source={appIcons.apple}
          />
        </View>
      </View>
    </Background>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    top:20
  },
  textContainer: {
    width: wp('80%'),
    // backgroundColor:'yellow',
    alignSelf: 'center',
  },
  textHeader: {
    fontWeight: '800',
    fontSize: 30,
    color: '#1F41BB',
    textAlign: 'center',
  },
  plainText: {
    fontWeight: '500',
    color: 'black',
    fontSize: 17,
  },
  buttonStyle: {},
  iconsContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: wp('35%'),
    marginTop: 20,
  },
  imageIcon: {
    height: 35,
    width: 40,
    borderRadius: 8,
  },
});
