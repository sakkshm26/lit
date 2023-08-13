import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  onNotification: function (notification) {
    console.log('Local notification', notification);
  },
  popInitialNotification: true,
  requestPermissions: true,
});

PushNotification.createChannel(
  {
    channelId: 'channel-1',
    channelName: 'Lit Channel',
    channelDescription: 'A channel for Lit app notifications',
    playSound: true,
    soundName: 'default',
    vibrate: true,
    vibration: 1000,
  },
  created => console.log(`channel created ${created}`),
);

export const LocalNotification = (title, message) => {
  PushNotification.localNotification({
    channelId: 'channel-1',
    channelName: 'Lit Channel',
    autoCancel: true,
    bigText: message,
    // subText: 'Local notification demo',
    title: title,
    message: "Expand me",
    channelDescription: 'A channel for Lit app notifications',
    playSound: true,
    soundName: 'default',
    importance: "max",
    vibrate: true,
    vibration: 1000,
  });
};
