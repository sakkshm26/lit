import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const UserIcon = ({first_name, last_name, containerStyle, textStyle}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.text, textStyle]}>
        {first_name[0]?.toUpperCase()}
        {last_name ? last_name[0]?.toUpperCase() : null}
      </Text>
    </View>
  );
};

export default UserIcon;

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#171717',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    shadowOffset: {width: 15, height: 15},
    shadowColor: 'white',
    shadowOpacity: 1.0,
    shadowRadius: 10,
  },
});
