import React from 'react';
import {useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Checkbox} from 'react-native-paper';

const ListItem = ({
  profile_image,
  title,
  text,
  rightTitle,
  rightText,
  rightIcon,
  leftIcon,
  select,
  onPress,
  style
}) => {
  const [checked, setChecked] = useState(false);
  return (
    <Pressable
      style={[styles.container, style]}
      onPress={
        rightIcon
          ? () => {
              setChecked(!checked);
              onPress();
            }
          : onPress
      }>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingRight: 50,
          width: '90%',
        }}>
        {profile_image ? (
          <Image
            source={{uri: profile_image}}
            style={{
              height: 45,
              width: 45,
              marginLeft: 5,
              marginRight: 15,
              borderRadius: 50,
            }}
          />
        ) : (
          leftIcon
        )}
        <View>
          <Text style={[styles.text]}>{title}</Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'PlusJakartaSans-Regular',
              color: 'grey',
              marginTop: 6,
            }}>
            {text}
          </Text>
        </View>
      </View>
      {rightText ? (
        <View>
          <Text style={[styles.text, {textAlign: 'center', color: "#10E9B5", fontFamily: "PlusJakartaSans-SemiBold"}]}>{rightTitle}</Text>
          <Text
            style={[
              styles.text,
              {fontSize: 12, color: 'grey', textAlign: 'center'},
            ]}>
            {rightText}
          </Text>
        </View>
      ) : null}
      {rightIcon ? (
        <Checkbox status={checked ? 'checked' : 'unchecked'} color="#10E9B5" />
      ) : null}
    </Pressable>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
  },
  text: {
    color: 'white',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
    lineHeight: 25,
  },
});
