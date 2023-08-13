import React from 'react';
import {View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const MaskedElement = props => {
  return (
    <View style={{backgroundColor: 'transparent', flex: 1}}>
      <LinearGradient
        colors={['#FFFFFF00', '#FFFFFF', '#FFFFFF00']}
        style={styles.linearGradient}></LinearGradient>
    </View>
  );
};

export default MaskedElement

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    width: '100%',
    borderRadius: 5,
  },
});
