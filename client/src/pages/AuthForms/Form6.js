import React, {useContext, useState} from 'react';
import {useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  Platform,
  PermissionsAndroid,
  KeyboardAvoidingView,
  ToastAndroid,
  Dimensions,
} from 'react-native';
import MyTextInput from '../../components/MyTextInput';
import {PERMISSIONS, check, RESULTS, request} from 'react-native-permissions';
import Contacts from 'react-native-contacts';
import {PrimaryButton, StickyButton} from '../../components';
import {API} from '../../api';
import axios from 'axios';
import {useForm, Controller} from 'react-hook-form';
import {Form6Schema} from '../../const';
import {yupResolver} from '@hookform/resolvers/yup';
import {AxiosContext} from '../../hooks/useAxios';
import {AuthContext} from '../../hooks/useAuth';
import * as Keychain from 'react-native-keychain';

const Form6 = ({navigation, route}) => {
  const route_data = route.params;
  const authContext = useContext(AuthContext);
  const {publicAxios} = useContext(AxiosContext);
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    setError,
    formState: {errors},
    clearErrors,
  } = useForm({
    resolver: yupResolver(Form6Schema),
  });

  const onSubmit = async data => {
    setLoading(true);
    try {
      const response = await publicAxios.post('/auth/unique/username', {
        username: data.username,
      });

      console.log(response.data);

      navigation.navigate('Form5', {...route_data, ...data});
    } catch (err) {
      console.log('Error', err);
      if (err?.response?.data?.message) {
        ToastAndroid.showWithGravity(
          err.response.data.message,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      }
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <StickyButton
        title="Continue"
        onPress={handleSubmit(onSubmit)}
        loading={loading}>
        <View style={styles.formContainer}>
          <Text style={styles.header}>Let's Build Your Profile</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <MyTextInput
                  name="first_name"
                  placeholder="First Name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.first_name}
                  inputStyle={{width: Dimensions.get('window').width * 0.42}}
                />
              )}
              name="first_name"
            />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <MyTextInput
                  name="last_name"
                  placeholder="Last Name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.last_name}
                  inputStyle={{width: Dimensions.get('window').width * 0.42}}
                />
              )}
              name="last_name"
            />
          </View>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <MyTextInput
                name="username"
                placeholder="Choose a username"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.username}
                inputStyle={{width: '100%'}}
              />
            )}
            name="username"
          />

          {errors.first_name?.message ? (
            <Text
              style={[styles.text, {color: '#8a031b', textAlign: 'center'}]}>
              {errors.first_name.message}
            </Text>
          ) : errors.last_name?.message ? (
            <Text
              style={[styles.text, {color: '#8a031b', textAlign: 'center'}]}>
              {errors.last_name.message}
            </Text>
          ) : errors.username?.message ? (
            <Text
              style={[styles.text, {color: '#8a031b', textAlign: 'center'}]}>
              {errors.username.message}
            </Text>
          ) : null}
        </View>
      </StickyButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    paddingTop: 20,
  },
  formContainer: {
    flex: 1,
    width: '90%',
    // alignItems: 'center'
  },
  header: {
    color: 'white',
    fontSize: 19,
    fontFamily: 'PlusJakartaSans-SemiBold',
    marginBottom: 30,
  },
  text: {
    color: 'white',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 15,
  },
});

export default Form6;
