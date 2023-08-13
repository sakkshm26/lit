import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useState} from 'react';
import {FriendNavigator, Home, InboxNavigator, ProfileNavigator} from '../pages';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Pressable, Vibration, View} from 'react-native';
import {useEffect} from 'react';
import PushNotification from 'react-native-push-notification';
import {AxiosContext} from '../hooks/useAxios';
import {useContext} from 'react';
import {LocalNotification} from '../services/index.js';

const AppNavigator = () => {
  const Tab = createMaterialTopTabNavigator();
  const [swipeEnabled, setSwipeEnabled] = useState(true);

  const {authAxios} = useContext(AxiosContext);

  useEffect(() => {
    PushNotification.configure({
      onRegister: async function (token) {
        console.log('Token', token);
        try {
          const response = await authAxios.post('/user/refreshFcm', {
            fcm_token: token.token,
          });
          console.log('Refreshed fcm response', response.data);
        } catch (err) {
          console.log(err);
        }
      },
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },
      onNotification: function (notification) {
        console.log(notification);
        LocalNotification(notification.title, notification.message);
      },
      senderID: '543802953818',
      popInitialNotification: true,
      requestPermissions: true,
    });
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarPosition="bottom"
      screenListeners={(props) => {
        if (props.route?.state?.index === 1) {
          setSwipeEnabled(false)
        } else {
          setSwipeEnabled(true)
        }
      }}
      screenOptions={{
        tabBarShowLabel: false,
        // headerStyle: {backgroundColor: 'black'},
        tabBarInactiveTintColor: 'white',
        tabBarActiveTintColor: '#f55f45',
        tabBarStyle: {
          backgroundColor: 'black',
          borderTopColor: '#4a4a4a',
          borderTopWidth: 0.2,
        },
        swipeEnabled: swipeEnabled,
        tabBarIndicatorStyle: {backgroundColor: "#f55f45", top: 0},
      }}>
      <Tab.Screen
        name="FriendNavigator"
        component={FriendNavigator}
        options={{
          tabBarIcon: props => (
            <Icon name="users" color={props.color} size={18} style={{width: 60}} />
          ),
          // headerShown: false,
        }}
        // listeners={({navigation}) => ({
        //   tabPress: () => Vibration.vibrate(15),
        // })}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: props => (
            <Icon name="gamepad" color={props.color} size={19} style={{width: 60}} />
          ),
          // headerShown: false,
        }}
        // listeners={({navigation}) => ({
        //   tabPress: () => Vibration.vibrate(15),
        // })}
      />
      <Tab.Screen
        name="Inbox"
        component={InboxNavigator}
        options={{
          tabBarIcon: props => (
            <Icon name="envelope" color={props.color} size={19} style={{width: 60}} />
          ),
          // headerShown: false,
        }}
        // listeners={({navigation}) => ({
        //   tabPress: () => Vibration.vibrate(15),
        // })}
      />
      <Tab.Screen
        name="ProfileNavigator"
        component={ProfileNavigator}
        options={{
          tabBarIcon: props => (
            <Icon name="user" color={props.color} size={19} style={{width: 60}} />
          ),
          /* headerTitle: 'Profile',
          headerTitleStyle: {
            color: 'white',
            fontFamily: 'PlusJakartaSans-SemiBold',
            fontSize: 18,
          },
          headerTitleAlign: 'center', */
        }}
        // listeners={({navigation}) => ({
        //   tabPress: () => Vibration.vibrate(15),
        // })}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
