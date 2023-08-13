import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Tokens} from '../../components';

const PollComplete = ({
  total_token_count,
  tokens_earned,
  setPollCompleted,
  getUser,
}) => {
  const handleCollectTokens = () => {
    setPollCompleted(false);
    getUser();
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {/* <Tokens token_count={total_token_count} /> */}
      <Text style={[styles.text]}>
        You have earned {tokens_earned} tokens
      </Text>
      <Pressable onPress={() => handleCollectTokens()} style={styles.button}>
        <Text
          style={[
            styles.text,
            {textAlign: 'center', fontSize: 15, fontFamily: 'PlusJakartaSans-SemiBold'},
          ]}>
          Collect
        </Text>
      </Pressable>
    </View>
  );
};

export default PollComplete;

const styles = StyleSheet.create({
  button: {
    borderColor: '#200220',
    borderWidth: 1,
    borderRadius: 7,
    paddingHorizontal: 20,
    height: 50,
    justifyContent: 'center',
    marginTop: 30,
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 17,
    fontFamily: 'PlusJakartaSans-Regular',
  },
});
