import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

const SettingsButton = ({iconLocation, text, onPress, style}) => {
  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      <Image source={iconLocation} style={{height: 30, width: 30, position: "absolute", left: 15}} />
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

export default SettingsButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: "center"
  },
  text: {
    color: 'black',
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
