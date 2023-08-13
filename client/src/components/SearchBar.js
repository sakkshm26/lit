import React from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MyTextInput from './MyTextInput';

const SearchBar = ({
  placeholder,
  value,
  onChangeText,
  onPress,
  searchStyle,
}) => {
  return (
    <>
      {onPress ? (
        <Pressable
          onPress={onPress}
          style={[
            searchStyle,
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'black',
              paddingHorizontal: 20,
              paddingVertical: 10,
            },
          ]}>
          <Text style={[styles.input, {color: '#595959'}]}>{placeholder}</Text>
          <Icon name="search" color="#f55f45" size={18} />
        </Pressable>
      ) : (
        <View
          style={[
            searchStyle,
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'black',
              paddingHorizontal: 20,
              paddingVertical: 10,
            },
          ]}>
          <TextInput
            value={value}
            autoCorrect={false}
            style={styles.input}
            placeholderTextColor="#393939"
            onChangeText={onChangeText}
            placeholder={placeholder}
            selectionColor={'#1e1e1e'}
            cursorColor={'#000'}
          />
          <Icon name="search" color="#f55f45" size={18} />
        </View>
      )}
    </>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  input: {
    color: 'white',
    padding: 3,
    width: '90%',
    fontSize: 17,
    fontFamily: 'PlusJakartaSans-Regular',
  },
});
