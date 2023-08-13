import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {InboxMessage, PrimaryButton} from '../../components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AuthHome = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <View
          style={[
            styles.message,
            {width: Dimensions.get('window').width * 0.7},
          ]}>
          <Text style={[styles.messageText, {textAlign: 'center'}]}>
            I want a date with you
          </Text>
        </View>
        <View
          style={[
            styles.message,
            {width: Dimensions.get('window').width * 0.8, marginTop: -10},
          ]}>
          <Text style={[styles.messageText, {textAlign: 'center'}]}>
            Your smile makes my heart melt
          </Text>
        </View>
        <View
          style={[
            styles.message,
            {
              width: Dimensions.get('window').width * 0.9,
              marginTop: -10,
              backgroundColor: 'white',
            },
          ]}>
          <Icon
            name="diamond"
            color="#E91045"
            style={{fontSize: 25, marginRight: 10}}
          />
          <Text style={[styles.messageText, {textAlign: 'center'}]}>
            Girl in 2nd year pursuing bachelors
          </Text>
        </View>
      </View>
      <View style={{width: '85%'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={[
              styles.text,
              {fontSize: 28, fontFamily: 'PlusJakartaSans-SemiBold'},
            ]}>
            See who likes{'  '}
          </Text>
          <Text
            style={[
              styles.text,
              {
                color: '#E91045',
                fontFamily: 'Pacifico-Regular',
                fontSize: 28,
              },
            ]}>
            You
          </Text>
        </View>
        <Text style={[styles.text, {color: 'grey', textAlign: 'center'}]}>
          Discover what your friends truly think of you in a safe and anonymous
          space
        </Text>
      </View>
      <View style={{width: '85%'}}>
        <View>
          <PrimaryButton
            title="Sign Up"
            onPress={() => navigation.navigate('Form3a')}
          />
          <TouchableOpacity
            style={{marginTop: 30}}
            onPress={() => navigation.navigate('Phone', {type: 'login'})}>
            <Text
              style={[
                styles.text,
                {
                  fontSize: 16,
                  textAlign: 'center',
                  fontFamily: 'PlusJakartaSans-SemiBold',
                },
              ]}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AuthHome;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Dimensions.get('window').height * 0.02,
    paddingBottom: Dimensions.get('window').height * 0.1
  },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 17,
    paddingHorizontal: 20,
    backgroundColor: '#E4E0E0',
    borderRadius: 10,
    elevation: 40,
  },
  messageText: {
    color: 'black',
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 15,
    textAlign: 'center',
  },
  text: {
    color: 'white',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
  },
});
