import {yupResolver} from '@hookform/resolvers/yup';
import React, {useState} from 'react';
import {useContext} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {MyTextInput, StickyButton} from '../../components';
import {LoginFormSchema} from '../../const';
import {AuthContext} from '../../hooks/useAuth';
import {AxiosContext} from '../../hooks/useAxios';
import * as Keychain from 'react-native-keychain';

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(LoginFormSchema),
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const authContext = useContext(AuthContext);
  const {publicAxios} = useContext(AxiosContext);

  const onSubmit = async data => {
    setLoading(true);
    let formatted_data = {password: data.password, phone: data.phone};
    try {
      const response = await publicAxios.post(
        '/auth/user/login',
        formatted_data,
      );
      setError(null);

      console.log(response);

      const {id, institute_id, token} = response.data;
      console.log(id, token);
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
      if (err?.response?.data?.message) {
        setError(err.response.data.message);
      }
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <StickyButton
        title="Login"
        onPress={handleSubmit(onSubmit)}
        loading={loading}>
        <View style={styles.formContainer}>
          <Controller
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
                name="password"
                placeholder="Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password}
                secureTextEntry={true}
              />
            )}
            name="password"
          />
          {errors.emailusername?.message ? (
            <Text style={{color: '#B00020'}}>
              {errors.emailusername.message}
            </Text>
          ) : errors.password?.message ? (
            <Text style={{color: '#B00020'}}>{errors.password.message}</Text>
          ) : error ? (
            <Text style={{color: '#B00020'}}>{error}</Text>
          ) : null}
        </View>
      </StickyButton>
    </View>
  );
};

export default Login;

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
