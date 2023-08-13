import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

const ProfileUserIcon = ({first_name, last_name, profile_image, onPress, imageStyle}) => {
  return (
    <>
      {profile_image ? (
        <Pressable onPress={onPress}>
          <Image
            source={{uri: profile_image}}
            style={[{height: 90, width: 90, borderRadius: 150}, imageStyle]}
          />
        </Pressable>
      ) : (
        <Pressable style={[styles.container, imageStyle]} onPress={onPress}>
          <Text style={styles.text}>
            {first_name[0].toUpperCase()}
            {last_name[0].toUpperCase()}
          </Text>
        </Pressable>
      )}
    </>
  );
};

export default ProfileUserIcon;

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 32,
    borderRadius: 150,
    borderColor: '#151515',
    borderWidth: 1,
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
    fontSize: 25,
  },
});
