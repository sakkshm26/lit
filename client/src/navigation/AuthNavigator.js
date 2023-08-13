import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {
  AuthHome,
  Form5,
  Form1,
  Form4,
  Login,
  Form2,
  Form6,
  Form3,
  Form2b,
  Form7,
  Form3a,
  Form5b,
  Phone,
  NewInstitute,
  Age,
  Photo,
} from '../pages';
import Icon from 'react-native-vector-icons/Feather';
import {TransitionPresets} from '@react-navigation/stack';
import {Easing} from 'react-native-reanimated';
import {Pressable, StyleSheet, Text} from 'react-native';

const AuthNavigator = ({navigation}) => {
  const Stack = createStackNavigator();

  const config = {
    animation: 'timing',
    config: {
      duration: 300,
      easing: Easing.out(Easing.poly(2)),
    },
  };

  return (
    <Stack.Navigator
      initialRouteName="AuthHome"
      screenOptions={{
        headerStyle: {backgroundColor: 'black', height: 30},
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS,
        transitionSpec: {
          close: config,
          open: config,
        },
      }}>
      <Stack.Screen
        name="AuthHome"
        component={AuthHome}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerLeft: ({onPress}) => (
            <Icon
              name="arrow-left"
              color="white"
              size={25}
              style={{paddingLeft: 10, paddingRight: 50}}
              onPress={() => navigation.goBack()}
            />
          ),
          headerTitle: 'Login',
          headerTitleStyle: styles.header,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="Form1"
        component={Form1}
        options={{
          headerLeft: ({onPress}) => (
            <Icon
              name="arrow-left"
              color="white"
              size={25}
              style={{paddingLeft: 10, paddingRight: 50}}
              onPress={() => navigation.goBack()}
            />
          ),
          headerTitle: 'Sign Up',
          headerTitleStyle: styles.header,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="Form2b"
        component={Form2b}
        options={{
          headerLeft: ({onPress}) => (
            <Icon
              name="arrow-left"
              color="white"
              size={25}
              style={{paddingLeft: 10, paddingRight: 50}}
              onPress={() => navigation.goBack()}
            />
          ),
          headerTitleStyle: {color: 'black'},
        }}
      />
      <Stack.Screen
        name="Form2"
        component={Form2}
        options={{
          headerLeft: ({onPress}) => (
            <Icon
              name="arrow-left"
              color="white"
              size={25}
              style={{paddingLeft: 10, paddingRight: 50}}
              onPress={() => navigation.goBack()}
            />
          ),
          headerTitleStyle: {color: 'black'},
        }}
      />
      <Stack.Screen
        name="Form3"
        component={Form3}
        options={{
          headerLeft: ({onPress}) => (
            <Icon
              name="arrow-left"
              color="white"
              size={25}
              style={{paddingLeft: 10, paddingRight: 50}}
              onPress={() => navigation.goBack()}
            />
          ),
          headerTitleStyle: {color: 'black'},
        }}
      />
      <Stack.Screen
        name="Form3a"
        component={Form3a}
        options={{
          headerLeft: ({onPress}) => (
            <Icon
              name="arrow-left"
              color="white"
              size={25}
              style={{paddingLeft: 10, paddingRight: 30}}
              onPress={() => navigation.goBack()}
            />
          ),
          headerTitleStyle: {color: 'black'},
        }}
      />
      <Stack.Screen
        name="Form4"
        component={Form4}
        options={{
          headerLeft: ({onPress}) => (
            <Icon
              name="arrow-left"
              color="white"
              size={25}
              style={{paddingLeft: 10, paddingRight: 50}}
              onPress={() => navigation.goBack()}
            />
          ),
          headerTitleStyle: {color: 'black'},
        }}
      />
      <Stack.Screen
        name="Form5"
        component={Form5}
        options={{
          headerLeft: ({onPress}) => (
            <Icon
              name="arrow-left"
              color="white"
              size={25}
              style={{paddingLeft: 10, paddingRight: 40}}
              onPress={() => navigation.goBack()}
            />
          ),
          headerTitleStyle: {color: 'black'},
        }}
      />
      <Stack.Screen
        name="Form5b"
        component={Form5b}
        options={{
          headerLeft: ({onPress}) => (
            <Icon
              name="arrow-left"
              color="white"
              size={25}
              style={{paddingLeft: 10, paddingRight: 50}}
              onPress={() => navigation.goBack()}
            />
          ),
          headerTitleStyle: {color: 'black'},
        }}
      />
      <Stack.Screen
        name="Form6"
        component={Form6}
        options={{
          headerLeft: ({onPress}) => (
            <Icon
              name="arrow-left"
              color="white"
              size={25}
              style={{paddingLeft: 10, paddingRight: 40}}
              onPress={() => navigation.goBack()}
            />
          ),
          headerTitleStyle: {color: 'black'},
        }}
      />
      <Stack.Screen
        name="Form7"
        component={Form7}
        options={{
          headerLeft: ({onPress}) => (
            <Icon
              name="arrow-left"
              color="white"
              size={25}
              style={{paddingLeft: 10, paddingRight: 50}}
              onPress={() => navigation.goBack()}
            />
          ),
          headerTitleStyle: {color: 'black'},
        }}
      />
      <Stack.Screen
        name="Phone"
        component={Phone}
        options={{
          headerLeft: ({onPress}) => (
            <Icon
              name="arrow-left"
              color="white"
              size={25}
              style={{paddingLeft: 10, paddingRight: 40}}
              onPress={() => navigation.goBack()}
            />
          ),
          headerTitleStyle: {color: 'black'},
        }}
      />
      <Stack.Screen
        name="NewInstitute"
        component={NewInstitute}
        options={{
          headerLeft: ({onPress}) => (
            <Icon
              name="arrow-left"
              color="white"
              size={25}
              style={{paddingLeft: 10, paddingRight: 50}}
              onPress={() => navigation.goBack()}
            />
          ),
          headerTitleStyle: {color: 'black'},
        }}
      />
      <Stack.Screen
        name="Age"
        component={Age}
        options={{
          gestureEnabled: false,
          headerLeft: ({onPress}) => (
            <Icon
              name="arrow-left"
              color="white"
              size={25}
              style={{paddingLeft: 10, paddingRight: 40}}
              onPress={() => navigation.goBack()}
            />
          ),
          headerTitleStyle: {color: 'black'},
        }}
      />
      <Stack.Screen
        name="Photo"
        component={Photo}
        options={{
          gestureEnabled: false,
          headerLeft: ({onPress}) => (
            <Icon
              name="arrow-left"
              color="white"
              size={25}
              style={{paddingLeft: 10, paddingRight: 40}}
              onPress={() => navigation.goBack()}
            />
          ),
          headerTitleStyle: {color: 'black'},
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

const styles = StyleSheet.create({
  header: {
    color: 'white',
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 16,
  },
  text: {
    color: 'white',
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
  },
});
