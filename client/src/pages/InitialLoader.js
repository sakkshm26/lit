import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

const InitialLoader = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={require('../assets/icons/logo.png')}
        style={{height: 50, width: 100}}
      />
      <Image
        source={require('../assets/icons/text.png')}
        style={{height: 15, width: 120, marginTop: 20}}
      />
    </View>
  );
};

export default InitialLoader;

export const styles = StyleSheet.create({
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Regular',
  },
});
