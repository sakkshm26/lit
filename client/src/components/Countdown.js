import React, { useContext } from 'react';
import {useEffect, useRef, useState} from 'react';
import {Linking, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { AxiosContext } from '../hooks/useAxios';
import SecondaryButton from './Buttons/SecondaryButton';

const Countdown = ({last_completed_date, getUser}) => {

  const {authAxios} = useContext(AxiosContext);

  const [minutes, setMinutes] = useState(
    39 - Math.floor((new Date() - new Date(last_completed_date)) / 60000),
  );
  const [seconds, setSeconds] = useState(
    59 - Math.floor(((new Date() - new Date(last_completed_date)) / 1000) % 60),
  );

  useEffect(() => {
    let myInterval = setInterval(async () => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
          const response = await authAxios.post("/poll/new-poll-notification")
          getUser();
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  return (
    <View style={styles.container}>
      <Icon name="lock" size={100} color="grey" />
      <Text
        style={[
          styles.text,
          {marginVertical: 50, fontFamily: 'PlusJakartaSans-SemiBold'},
        ]}>
        New polls available in
      </Text>
      <Text style={styles.text}>
        {minutes < 10 ? `0${minutes}` : minutes}:
        {seconds < 10 ? `0${seconds}` : seconds}
      </Text>
      <SecondaryButton
        title="Invite friends"
        style={{textAlign: 'center', width: 150, marginTop: 50}}
        textStyle={{fontSize: 15}}
        onPress={() =>
          Linking.openURL(
            'whatsapp://send?text=Dude! Our entire college is complimenting each other on lit. Download it from here: l.linklyhq.com/l/1g9KX',
          )
        }
      />
    </View>
  );
};

export default Countdown;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 20,
  },
});
