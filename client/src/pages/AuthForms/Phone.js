import React, {useContext, useEffect, useState} from 'react';
import {Dimensions, StyleSheet, Text, TextInput, ToastAndroid, View} from 'react-native';
import {OTPInput, StickyButton} from '../../components';
import {SixDigitNumberRegex, TenDigitNumberRegex} from '../../const';
import {AxiosContext} from '../../hooks/useAxios';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../../hooks/useAuth';
import * as Keychain from 'react-native-keychain';

const Phone = ({navigation, route}) => {
  const route_data = route.params;
  const [phone, setPhone] = useState();
  const [loading, setLoading] = useState(false);
  const [OTPScreen, setOTPScreen] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [otp, setOtp] = useState('');

  const {publicAxios} = useContext(AxiosContext);
  const authContext = useContext(AuthContext);

  const handleSubmit = async () => {
    if (OTPScreen) {
      if (SixDigitNumberRegex.test(otp)) confirmCode();
      else
        ToastAndroid.showWithGravity(
          'OTP is not valid',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
    } else {
      if (TenDigitNumberRegex.test(phone)) {
        try {
          setLoading(true);

          if (route_data.type === 'login') {
            const response = await publicAxios.post('/auth/unique/phone', {
              phone: phone,
              type: 'login',
            });
          } else {
            const response = await publicAxios.post('/auth/unique/phone', {
              phone: phone,
              type: 'signup',
            });
          }

          // auth().settings.appVerificationDisabledForTesting = true;

          const confirmation = await auth().signInWithPhoneNumber(
            `+91${phone}`,
          );
          // console.log('confirmation', confirmation);
          setConfirm(confirmation);
          setOTPScreen(true);
        } catch (err) {
          console.log(err);
          if (err?.response?.data?.message) {
            ToastAndroid.showWithGravity(
              err.response.data.message,
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
          } else
            ToastAndroid.showWithGravity(
              'Something went wrong, please try again later',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
        }
        setLoading(false);
      } else {
        ToastAndroid.showWithGravity(
          'Phone number is not valid',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      }
    }
  };

  const confirmCode = async () => {
    try {
      setLoading(true);
      console.log(otp);
      const response = await confirm.confirm(otp);
      if (response) {
        if (route_data.type === 'login') {
          const loginResponse = await publicAxios.post('/auth/user/login', {
            phone: phone,
          });

          console.log(loginResponse.data);

          const {id, institute_id, token} = loginResponse.data;

          authContext.setAuthState({
            token,
            id,
            institute_id,
          });

          await Keychain.setGenericPassword(
            'user',
            JSON.stringify({
              id,
              token,
              institute_id,
            }),
          );
        } else navigation.navigate('Age', {...route_data, phone: phone});
      }
    } catch (error) {
      console.log(error);
      if (error.code === 'auth/invalid-verification-code') {
        ToastAndroid.showWithGravity(
          'OTP is invalid',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      } else if (error.code === 'auth/session-expired') {
        ToastAndroid.showWithGravity(
          'OTP has expired. Please re-send the code.',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      }
    }
    setLoading(false);
  };

  const onAuthStateChanged = user => {
    // console.log('User', user);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <View style={styles.container}>
      <StickyButton title={OTPScreen ? "Verify" : "Send"} onPress={handleSubmit} loading={loading}>
        {OTPScreen ? (
          <View style={styles.innerContainer}>
            <OTPInput otp={otp} setOtp={setOtp} />
          </View>
        ) : (
          <View style={styles.innerContainer}>
            <Text style={styles.header}>What's Your Phone Number?</Text>
            <Text
              style={[
                styles.text,
                {
                  color: 'grey',
                  lineHeight: 21,
                  letterSpacing: 0.2
                },
              ]}>
              We protect our community by making sure everyone on LIT is real
            </Text>
            <View
              style={{
                marginTop: 40,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: 15,
                    borderWidth: 1,
                    borderColor: '#383838',
                    paddingVertical: 12.5,
                    borderRadius: 10,
                    width: Dimensions.get('window').width * 0.17,
                    textAlign: "center"
                  },
                ]}>
                +91
              </Text>
              <TextInput
                keyboardType={'phone-pad'}
                maxLength={10}
                value={phone}
                autoCorrect={false}
                style={[
                  styles.input,
                  {
                    borderWidth: 1,
                    borderColor: '#383838',
                    borderRadius: 10,
                  },
                ]}
                placeholder="Phone Number"
                placeholderTextColor="#444444"
                onChangeText={text => setPhone(text)}
                autoFocus={true}
              />
            </View>
            <Text
              style={[
                styles.text,
                {
                  marginTop: 15,
                  color: 'grey',
                  letterSpacing: 0.2
                },
              ]}>
              You will receive an OTP on this number
            </Text>
          </View>
        )}
      </StickyButton>
    </View>
  );
};

export default Phone;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    paddingTop: 20,
  },
  innerContainer: {
    flex: 1,
    width: '90%',
  },
  header: {
    color: 'white',
    fontSize: 19,
    fontFamily: 'PlusJakartaSans-SemiBold',
    marginBottom: 10,
  },
  text: {
    color: 'white',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 13,
  },
  input: {
    color: 'white',
    width: Dimensions.get('window').width * 0.67,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    lineHeight: 26,
    letterSpacing: 0.5,
  },
});
