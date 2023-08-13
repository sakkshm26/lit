import React, {useRef} from 'react';
import {useState} from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const OTPInput = ({otp, setOtp}) => {
  const inputRef = useRef();
  const [focused, setFocused] = useState(1);

  const Box = ({isFocused, value}) => {
    return (
      <View
        style={[
          styles.input,
          {backgroundColor: isFocused ? '#151515' : 'black'},
        ]}>
        <Text style={styles.inputText}>{value}</Text>
      </View>
    );
  };

  return (
    <View>
      <Text style={styles.header}>Verify your number</Text>
      <Text
        style={[
          styles.text,
          {
            color: 'grey',
            lineHeight: 21,
            letterSpacing: 0.2
          },
        ]}>
        Enter the verification code we have sent by text  on your phone
      </Text>
      <TextInput
        autoFocus
        style={styles.hiddenInput}
        keyboardType="numeric"
        contextMenuHidden={true}
        value={otp}
        onChangeText={value => {
          setOtp(value);
          value.length === 6 ? setFocused(null) : setFocused(value.length + 1);
        }}
        maxLength={6}
        ref={inputRef}
      />
      <Pressable
        style={{flexDirection: 'row', marginTop: 40}}
        onPress={() => inputRef.current.focus()}>
        <Box isFocused={focused === 1} value={otp[0]} />
        <Box isFocused={focused === 2} value={otp[1]} />
        <Box isFocused={focused === 3} value={otp[2]} />
        <Box isFocused={focused === 4} value={otp[3]} />
        <Box isFocused={focused === 5} value={otp[4]} />
        <Box isFocused={focused === 6} value={otp[5]} />
      </Pressable>
    </View>
  );
};

export default OTPInput;

const styles = StyleSheet.create({
  header: {
    color: 'white',
    fontSize: 19,
    fontFamily: 'PlusJakartaSans-SemiBold',
    marginBottom: 10,
  },
  text: {
    color: 'white',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 13,
  },
  input: {
    marginHorizontal: 5,
    height: 45,
    width: 40,
    borderRadius: 6,
    borderWidth: 0.7,
    borderColor: '#373737',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputText: {
    color: 'white',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 20,
  },
  hiddenInput: {
    height: 0,
    width: 0,
    position: 'absolute',
  },
});
