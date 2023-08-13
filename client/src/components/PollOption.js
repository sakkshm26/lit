import React from 'react';
import {Dimensions, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import UserIcon from './UserIcon';

const PollOption = ({
  onPress,
  selected,
  first_name,
  last_name,
  message,
  full_name,
  profile_image,
}) => {
  return (
    <Pressable
      onPress={message ? null : onPress}
      style={[
        styles.container,
        {
          borderColor: '#222222',
          backgroundColor: selected ? 'white' : '#a6a6a6',
        },
      ]}>
      {profile_image ? (
        <Image
          source={{uri: profile_image}}
          style={{
            height: 40,
            width: 40,
            borderRadius: 50,
          }}
        />
      ) : (
        <UserIcon
          first_name={first_name || full_name?.split(' ')[0]}
          last_name={last_name || full_name?.split(' ')[1]}
          containerStyle={{
            height: 40,
            width: 40,
          }}
          textStyle={{fontSize: 14}}
        />
      )}
      <View>
        <Text
          style={[
            styles.text,
            {
              color: 'black',
              fontFamily: 'PlusJakartaSans-SemiBold',
            },
          ]}>
          {first_name
            ? first_name.length > 12
              ? `${first_name.slice(0, 11)}...`
              : first_name
            : full_name
            ? full_name.length > 12
              ? `${full_name.slice(0, 11)}...`
              : full_name
            : null}
        </Text>
      </View>
    </Pressable>
  );
};

export default PollOption;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    width: Dimensions.get('window').width * 0.38,
    height: Dimensions.get('window').width * 0.25,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 8,
    marginVertical: 8,
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 25,
    fontFamily: 'PlusJakartaSans-Regular',
  },
});
