import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const InboxMessage = ({message, onPress, gender, viewed}) => {
  return (
    <Pressable
      style={[
        styles.container,
        {backgroundColor: viewed ? '#818181' : '#c8c8c8'},
      ]}
      onPress={onPress}>
      {gender === 'MALE' ? (
        <Icon
          name="diamond"
          color={viewed ? "#007a8d" : "#04aec9"}
          style={{fontSize: 25, marginRight: 20}}
        />
      ) : gender === 'FEMALE' ? (
        <Icon
          name="diamond"
          color={viewed ? "#970025" : "#E91045"}
          style={{fontSize: 25, marginRight: 20}}
        />
      ) : (
        <Icon
          name="diamond"
          color={viewed ? "#037a3e" : "#03a956"}
          style={{fontSize: 25, marginRight: 20}}
        />
      )}
      <Text style={[styles.text, {color: 'black'}]}>{message}</Text>
    </Pressable>
  );
};

export default InboxMessage;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 17,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 15,
    elevation: 15,
  },
  text: {
    color: 'black',
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
    letterSpacing: 0.1,
  },
});
