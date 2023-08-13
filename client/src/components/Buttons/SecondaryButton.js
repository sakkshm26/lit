import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

const SecondaryButton = ({title, onPress, style, textStyle, active}) => {
  return (
    <TouchableOpacity
      style={[
        styles.option,
        {borderColor: active ? '#f55f45' : '#383838'},
        style,
      ]}
      onPress={onPress}>
      <Text style={[styles.optionText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default SecondaryButton;

const styles = StyleSheet.create({
  option: {
    padding: 15,
    // margin: 10,
    width: 200,
    borderColor: '#1b1b1b',
    borderWidth: 1,
    borderRadius: 8,
  },
  optionText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    textAlign: 'center',
  },
});
