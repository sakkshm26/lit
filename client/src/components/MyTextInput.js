import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {transparent} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

const MyTextInput = ({
  value,
  keyboardType,
  maxLength,
  secureTextEntry,
  error,
  inputContainerStyle,
  inputStyle,
  phone,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {phone ? (
        <Text style={{color: 'white', position: 'absolute'}}>+91 - </Text>
      ) : null}
      <TextInput
        keyboardType={keyboardType || 'default'}
        maxLength={maxLength || 20}
        value={value}
        autoCorrect={false}
        secureTextEntry={secureTextEntry || false}
        style={[
          styles.input,
          inputStyle,
          {
            borderColor: '#222222',
            paddingLeft: phone ? 20 : 15,
            paddingRight: 15
          },
        ]}
        placeholderTextColor="#444444"
        {...props}
      />
    </View>
  );
};

export default MyTextInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  input: {
    color: 'white',
    borderWidth: 0.5,
    paddingVertical: 10,
    borderRadius: 10,
    width: 190,
    textAlign: 'center',
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
  },
});
