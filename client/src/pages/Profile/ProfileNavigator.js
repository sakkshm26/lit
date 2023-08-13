import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React, {useLayoutEffect} from 'react';
import {Easing} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Feather';
import Profile from './Profile';
import Settings from './Settings';

const InboxNavigator = ({navigation, route}) => {
  const Stack = createStackNavigator();

  const config = {
    animation: 'timing',
    config: {
      duration: 300,
      easing: Easing.out(Easing.poly(2)),
    },
  };

  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === 'Settings') {
      navigation.setOptions({
        tabBarStyle: {display: 'none'},
      });
    } else {
      navigation.setOptions({
        headerStyle: {backgroundColor: 'black'},
        tabBarStyle: {
          backgroundColor: 'black',
          borderTopColor: '#4a4a4a',
          borderTopWidth: 0.2,
        },
        tabBarShowLabel: false,
        tabBarInactiveTintColor: 'white',
        tabBarActiveTintColor: '#f55f45',
      });
    }
  }, [navigation, route]);

  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerStyle: {backgroundColor: 'black'},
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS,
        transitionSpec: {
          close: config,
          open: config,
        },
      }}>
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerLeft: ({onPress}) => (
            <Icon
              name="arrow-left"
              color="white"
              size={25}
              style={{paddingLeft: 10, paddingRight: 50}}
              onPress={() => navigation.pop()}
            />
          ),
          headerTitle: 'Settings',
          headerTitleStyle: {
            fontFamily: 'PlusJakartaSans-SemiBold',
            fontSize: 18,
            color: 'white'
          },
          headerTitleAlign: "center"
        }}
      />
    </Stack.Navigator>
  );
};

export default InboxNavigator;
