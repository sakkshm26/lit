import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

const DegreeYear = ({title, onPress, style, active}) => {
  return (
    <TouchableOpacity
      style={[
        styles.option,
        {borderColor: active ? '#f55f45' : '#383838'},
        style,
      ]}
      onPress={onPress}>
      <Text style={styles.optionText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default DegreeYear;

const styles = StyleSheet.create({
  option: {
    width: 100,
    height: 55,
    // borderColor: '#383838',
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  optionText: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-Regular',
    textAlign: 'center',
  },
});
