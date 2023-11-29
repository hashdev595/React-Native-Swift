import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, KeyboardAvoidingView, ActivityIndicator} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {AppButton} from '../../../components/appButton/AppButton';
import {AppInput, Background} from '../../../components';
import {appIcons, appLotify} from '../../../assets';
import auth from '@react-native-firebase/auth'

const Login = ({navigation}) => {

  //states

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  //firebase

  const handleLogin = async () => {
    if (!email || !password) {
      const errorMessage = 'enter email and password*';
      setError(errorMessage);
    } else {
      try {
        setLoading(true);
        const userCredential = await auth().signInWithEmailAndPassword(
          email,
          password,
        );
        // userCredential();
        console.log('user credentail', userCredential);
        setLoading(false);
        navigation.navigate('App');
      } catch (error) {
        setError(error.message);
        setLoading(false)
      }
    }
  };
  return (
    <Background>
      <KeyboardAvoidingView style={styles.mainContainer}>
        <View style={[styles.textContainer, {marginTop: hp('10%')}]}>
          <Text style={[styles.textHeader]}>Login here</Text>
          <Text
            style={[
              styles.plainText,
              {textAlign: 'center', marginTop: hp('7%')},
            ]}>
            Welcome back you’ve been missed!
          </Text>
        </View>
        <View>
          <AppInput onChangeText={text => setEmail(text)} value={email} placeholder={'Email'} />
          <AppInput onChangeText={text => setPassword(text)} value={password} secureTextEntry={true} placeholder={'Password'} />
          <Text style={{color:'red'}}>{error}</Text>
          {loading ? <ActivityIndicator color={'#1F41BB'}/>: null}
          <Text
            style={{textAlign: 'right', marginVertical: 30, color: '#1F41BB'}}>
            Forgot your password?
          </Text>
        </View>
        <View style={styles.buttonStyle}>
          <AppButton
            lable={'Sign In'}
            onPress={handleLogin}
          />
        </View>
        <Text onPress={()=>{navigation.navigate('SignUp')}} style={{textAlign: 'center', marginVertical: 30, color: 'black'}}>
          Create new account
        </Text>
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
      </KeyboardAvoidingView>
    </Background>
  );
};

export default Login;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    top:20
  },
  textContainer: {
    width: wp('60%'),
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
    fontSize: 20,
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
