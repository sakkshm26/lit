import React, {useContext, useState} from 'react';
import {
  Image,
  PermissionsAndroid,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {Checkbox} from 'react-native-paper';
import {PrimaryButton, StickyButton} from '../../components';
import Contacts from 'react-native-contacts';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {AxiosContext} from '../../hooks/useAxios';
import {AuthContext} from '../../hooks/useAuth';
import * as Keychain from 'react-native-keychain';

const Form5b = ({navigation, route}) => {
  const route_data = route.params;
  const [allowInvites, setAllowInvites] = useState(true);
  const [loading, setLoading] = useState(false);
  const {publicAxios} = useContext(AxiosContext);
  const authContext = useContext(AuthContext);

  const handleSubmit = async data => {
    setLoading(true);
    try {
      let formatted_data = {...route_data, allow_contact_invites: allowInvites};
      console.log('Submitting data ', formatted_data);
      const response = await publicAxios.post(
        '/auth/user/signup',
        formatted_data,
      );
      if (route_data.image_data) {
        const upload_response = await publicAxios.post(
          `/getlist/uploadImage/${response.data.id}`,
          route_data.image_data,
          {
            headers: {'Content-Type': 'multipart/form-data'},
          },
        );
        console.log(">>>>", upload_response.data.user)
      }
      const {id, institute_id, token} = response.data;
      authContext.setAuthState({
        token,
        id,
        institute_id,
      });

      await Keychain.setGenericPassword(
        'user',
        JSON.stringify({
          id,
          token,
          institute_id,
        }),
      );
    } catch (err) {
      console.log('Login Failed', err);
    }

    setLoading(false);
  };

  const requestPermission = async () => {
    try {
      let perm = await Contacts.checkPermission();
      if (perm !== 'authorized') {
        try {
          const req = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          );
          if (req === 'granted') {
            handleSubmit();
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        handleSubmit();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Image
          source={require('../../assets/icons/contacts.png')}
          style={{height: 120, width: 100, marginBottom: 50}}
        />
        <View>
          <Text style={[styles.header, {textAlign: 'center'}]}>
            Find contacts on LIT
          </Text>
          <Text
            style={[
              styles.text,
              {
                textAlign: 'center',
                paddingHorizontal: 20,
                marginTop: 10,
                lineHeight: 20,
                letterSpacing: 0.2,
              },
            ]}>
            LIT is better with friends. See if any of your contacts are already
            using LIT app.
          </Text>
        </View>
        <PrimaryButton
          title="Allow"
          onPress={requestPermission}
          buttonStyle={{width: '90%', marginTop: 50}}
          loading={loading}
        />
      </View>
      <View
        style={{
          marginBottom: 30,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Checkbox
          status={allowInvites ? 'checked' : 'unchecked'}
          color="grey"
          onPress={() => setAllowInvites(!allowInvites)}
        />
        <Text style={[styles.text, {letterSpacing: 0.2}]}>
          Consent to invite your contacts to this app
        </Text>
      </View>
    </View>
  );
};

export default Form5b;

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  header: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  text: {
    color: 'grey',
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-Regular',
  },
});
