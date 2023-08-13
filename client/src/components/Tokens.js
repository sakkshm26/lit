import React from 'react';
import {Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Tokens = ({token_count, containerStyle}) => {
  return (
    <View
      style={[
        containerStyle,
        {
          flexDirection: 'row',
          alignItems: 'center',
        },
      ]}>
      <Icon name="coins" color="#d0ad1a" size={22} />
      <Text
        style={{
          color: 'white',
          fontSize: 17,
          fontFamily: 'PlusJakartaSans-Regular-SemiBold',
          marginLeft: 10,
        }}>
        {token_count}
      </Text>
    </View>
  );
};

export default Tokens;
