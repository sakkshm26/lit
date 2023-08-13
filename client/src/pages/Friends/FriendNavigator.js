import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React, {useLayoutEffect} from 'react';
import {View} from 'react-native';
import {Easing} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Feather';
import FriendList from './FriendList';
import FriendSearch from './FriendSearch';

const FriendNavigator = ({navigation, route}) => {
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
    if (routeName === 'FriendSearch') {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
    } else {
      navigation.setOptions({
        // headerStyle: {backgroundColor: 'black'},
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
      initialRouteName="FriendList"
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
        name="FriendList"
        component={FriendList}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FriendSearch"
        component={FriendSearch}
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
          headerTitle: 'Search Friends',
          headerTitleStyle: {
            color: 'white',
            fontFamily: 'PlusJakartaSans-SemiBold',
            fontSize: 18,
          },
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
};

export default FriendNavigator;
