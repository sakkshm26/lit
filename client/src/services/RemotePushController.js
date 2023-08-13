import React, {useContext, useEffect} from 'react';
import PushNotification from 'react-native-push-notification';
import {AxiosContext} from '../hooks/useAxios';

const RemotePushController = () => {
  const {authAxios} = useContext(AxiosContext);

  useEffect(() => {
    PushNotification.configure({
      onRegister: async function (token) {
        console.log('Token', token);
        try {
          const response = await authAxios.post('/user/refreshFcm', {
            fcm_token: token.token,
          });
        } catch (err) {
          console.log(err);
        }
      },
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },
      onNotification: function (notification) {
        console.log('Remote notification =>', notification);
      },
      senderID: '543802953818',
      popInitialNotification: true,
      requestPermissions: true,
    });
  }, []);
  return null;
};

export default RemotePushController;
