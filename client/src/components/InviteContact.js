import React from 'react';
import {Image, Linking, Pressable, StyleSheet, Text, View} from 'react-native';
import UserIcon from './UserIcon';

const InviteContact = ({first_name, last_name, phone}) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingRight: 70,
          width: '80%',
        }}>
        <UserIcon
          first_name={first_name}
          last_name={last_name}
          containerStyle={{
            height: 45,
            width: 45,
            marginLeft: 5,
            marginRight: 15,
          }}
          textStyle={{fontSize: 17}}
        />
        <View>
          <Text style={styles.text}>
            {first_name} {last_name}
          </Text>
        </View>
      </View>
      <Pressable
        onPress={() =>
          Linking.openURL(
            `whatsapp://send?text=Dude! Our entire college is complimenting each other on lit. Download it from here: l.linklyhq.com/l/1g9KX&phone=${phone}`,
          )
        }>
        <View style={styles.button}>
          <Text style={[styles.text, {textAlign: 'center', fontSize: 15}]}>
            Invite
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default InviteContact;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  button: {
    borderColor: '#9E9E9E',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 35,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 15,
    lineHeight: 18,
  },
});
