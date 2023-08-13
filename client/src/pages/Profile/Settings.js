import React, {useContext} from 'react';
import {
  Dimensions,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import {SettingsButton} from '../../components';
import {AuthContext} from '../../hooks/useAuth';

const Settings = () => {
  const {logout} = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <SettingsButton
        iconLocation={require('../../assets/icons/privacy.png')}
        text="Privacy Policy"
        style={styles.button}
        onPress={() =>
          ToastAndroid.showWithGravity(
            'Coming soon!',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          )
        }
      />
      <SettingsButton
        iconLocation={require('../../assets/icons/book.png')}
        text="How to use?"
        style={styles.button}
        onPress={() =>
          ToastAndroid.showWithGravity(
            'Coming soon!',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          )
        }
      />
      <SettingsButton
        iconLocation={require('../../assets/icons/store.png')}
        text="Shop"
        style={styles.button}
        onPress={() =>
          ToastAndroid.showWithGravity(
            'Coming soon!',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          )
        }
      />
      <SettingsButton
        iconLocation={require('../../assets/icons/star.png')}
        text="Rate us"
        style={styles.button}
        onPress={() =>
            Linking.openURL("https://play.google.com/store/apps/details?id=com.exhibitone.litapp")
        }
      />
      <Pressable onPress={logout}>
        <Text style={[styles.text, {marginTop: 30, fontSize: 16}]}>Logout</Text>
      </Pressable>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  button: {
    marginVertical: 10,
    width: Dimensions.get('window').width * 0.9,
    borderRadius: 15,
  },
  text: {
    color: 'white',
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 15,
  },
});
