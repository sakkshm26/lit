import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const ListItemSeparator = () => {
  return (
    <View style={styles.container}>
      <Text style={{color: 'white'}}></Text>
    </View>
  );
};

export default ListItemSeparator;

export const styles = StyleSheet.create({
  container: {
    height: 0.6,
    width: '100%',
    backgroundColor: '#222222',
  },
});
