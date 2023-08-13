import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React, {useLayoutEffect} from 'react';
import {useState} from 'react';
import {View} from 'react-native';
import {Easing} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Feather';
import Message from './Message';
import Messages from './Messages';

const InboxNavigator = ({navigation, route}) => {
  const Stack = createStackNavigator();
  const [remainingHints, setRemainingHints] = useState();

  const config = {
    animation: 'timing',
    config: {
      duration: 300,
      easing: Easing.out(Easing.poly(2)),
    },
  };

  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === 'Message') {
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
      initialRouteName="Messages"
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
        name="Messages"
        /* component={props => (
          <Messages
            {...props}
            remainingHints={remainingHints}
            setRemainingHints={setRemainingHints}
          />
        )} */
        options={{
          headerShown: false,
        }}>
        {props => (
          <Messages
            {...props}
            remainingHints={remainingHints}
            setRemainingHints={setRemainingHints}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="Message"
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
          headerTitle: '',
        }}>
        {props => (
          <Message
            {...props}
            remainingHints={remainingHints}
            setRemainingHints={setRemainingHints}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default InboxNavigator;
