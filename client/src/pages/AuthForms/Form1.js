import React, {useContext, useState} from 'react';
import {useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ToastAndroid
} from 'react-native';
import MyTextInput from '../../components/MyTextInput';
import {PERMISSIONS, check, RESULTS, request} from 'react-native-permissions';
import Contacts from 'react-native-contacts';
import {PrimaryButton, StickyButton} from '../../components';
import {API} from '../../api';
import axios from 'axios';
import {useForm, Controller} from 'react-hook-form';
import {Form1Schema} from '../../const';
import {yupResolver} from '@hookform/resolvers/yup';
import {AxiosContext} from '../../hooks/useAxios';

const Form1 = ({navigation}) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: {errors},
    clearErrors,
  } = useForm({
    resolver: yupResolver(Form1Schema),
  });

  const {publicAxios} = useContext(AxiosContext);

  const onSubmit = async data => {
    try {
      const response = await publicAxios.post('/auth/unique/username', {
        username: data.username,
      });

      console.log(response.data);

      navigation.navigate('Form7', data);
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
  };

  return (
    <View style={styles.container}>
      <StickyButton title="Next" onPress={handleSubmit(onSubmit)}>
        <View style={styles.formContainer}>
          {/* <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <MyTextInput
                inputStyle={styles.input}
                inputContainerStyle={styles.inputContainer}
                name="email"
                placeholder="Email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email}
              />
            )}
            name="email"
          /> */}
          {/* <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <MyTextInput
                inputStyle={styles.input}
                inputContainerStyle={styles.inputContainer}
                name="phone"
                placeholder="Phone"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.phone}
                phone={true}
                maxLength={10}
                keyboardType="number-pad"
              />
            )}
            name="phone"
          /> */}
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <MyTextInput
                inputStyle={styles.input}
                inputContainerStyle={styles.inputContainer}
                name="username"
                placeholder="Username"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.username}
              />
            )}
            name="username"
          />
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <MyTextInput
                inputStyle={styles.input}
                inputContainerStyle={styles.inputContainer}
                name="age"
                placeholder="Age"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.age}
                maxLength={2}
                keyboardType="number-pad"
              />
            )}
            name="age"
          />
        </View>
      </StickyButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  formContainer: {
    alignItems: 'center',
    flex: 1,
  },
  errorText: {
    color: '#B00020',
    fontFamily: 'PlusJakartaSans-Regular',
  },
});

export default Form1;
