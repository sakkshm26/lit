import {useState, useContext, useCallback} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AuthContext} from '../hooks/useAuth';
import {createStackNavigator} from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import * as Keychain from 'react-native-keychain';
import {useEffect} from 'react';
import {InitialLoader} from '../pages';
import {ProgressBar} from 'react-native-paper';

const MainRouter = () => {
  const authContext = useContext(AuthContext);
  const [status, setStatus] = useState('loading');
  const [progress, setProgress] = useState(null);

  const loadJWT = useCallback(async () => {
    try {
      const value = await Keychain.getGenericPassword();
      const jwt = JSON.parse(value.password);

      authContext.setAuthState({
        token: jwt.token || null,
        id: jwt.id,
        institute_id: jwt.institute_id,
      });
      setStatus('success');
    } catch (error) {
      setStatus('error');
      console.log(`Keychain Error: ${error.message}`);
      authContext.setAuthState({
        token: null,
        id: null,
        institute_id: null,
      });
    }
  }, []);

  const handleAuthScreenChange = state => {
    console.log(state.routes[0]?.state.routes);
    if (
      state.routes[0]?.state?.routes.length &&
      state.routes[0]?.state?.routes[1]?.name === 'Phone'
    )
      setProgress(null);
    else {
      let stack_length = state.routes[0]?.state?.routes?.length;
      stack_length === 1
        ? setProgress(null)
        : stack_length === 2
        ? setProgress(0)
        : stack_length === 3
        ? setProgress(0.1)
        : stack_length === 4
        ? setProgress(0.2)
        : stack_length === 5
        ? setProgress(0.3)
        : stack_length === 6
        ? setProgress(0.4)
        : stack_length === 7
        ? setProgress(0.5)
        : stack_length === 8
        ? setProgress(0.6)
        : stack_length === 9
        ? setProgress(0.7)
        : stack_length === 10
        ? setProgress(0.8)
        : stack_length === 11
        ? setProgress(0.9)
        : null;
    }
  };

  useEffect(() => {
    loadJWT();
  }, [loadJWT]);

  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  return (
    <NavigationContainer
      theme={DarkTheme}
      onStateChange={handleAuthScreenChange}>
      {status === 'loading' ? (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="InitialLoader" component={InitialLoader} />
        </Stack.Navigator>
      ) : authContext?.authState?.id ? (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="AppNavigator" component={AppNavigator} />
        </Stack.Navigator>
      ) : (
        <>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: 'black',
              paddingTop: 30,
              paddingBottom: 20,
            }}>
            {progress !== null ? (
              <ProgressBar
                progress={progress}
                color="#E90F44"
                style={{
                  width: Dimensions.get('window').width * 0.9,
                  height: 8,
                  borderRadius: 20,
                  backgroundColor: '#2a2a2a',
                }}
              />
            ) : null}
          </View>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
          </Stack.Navigator>
        </>
      )}
    </NavigationContainer>
  );
};

export default MainRouter;
