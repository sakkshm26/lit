import React, {useContext} from 'react';
import {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {AxiosContext} from '../hooks/useAxios';

const ListItem2 = ({
  id,
  user_id,
  profile_image,
  title,
  text,
  leftIcon,
  onPress,
  type,
}) => {
  const [added, setAdded] = useState(false);
  const [requestStatus, setRequestStatus] = useState('initial');
  const [loading, setLoading] = useState(false);
  const {authAxios} = useContext(AxiosContext);

  const handlePressUser = async () => {
    setLoading(true);
    if (added) {
      try {
        const response = await authAxios.post('/friends/request/delete', {
          friend_request_by_id: user_id,
          friend_request_to_id: id,
        });
        setAdded(!added);
        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const response = await authAxios.post('/friends/request/create', {
          friend_request_by_id: user_id,
          friend_request_to_id: id,
        });
        setAdded(!added);
        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    }
    setLoading(false);
  };

  const handlePressRequest = async type => {
    setLoading(true);
    if (type === 'reject') {
      try {
        const response = await authAxios.post('/friends/request/delete', {
          friend_request_by_id: id,
          friend_request_to_id: user_id,
        });
        console.log(response.data);
        setRequestStatus('deleted');
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const response = await authAxios.post('/friends/create', {
          friend_who_added_id: id,
          friend_who_accepted_id: user_id,
        });
        console.log(response.data);
        setRequestStatus('accepted');
      } catch (err) {
        console.log(err);
      }
    }
    setLoading(false);
  };

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingRight: 70,
          width: '80%',
        }}>
        {profile_image ? (
          <Image
            source={{uri: profile_image}}
            style={{
              height: 45,
              width: 45,
              marginLeft: 5,
              marginRight: 15,
              borderRadius: 50,
            }}
          />
        ) : (
          leftIcon
        )}
        <View>
          <Text style={styles.text}>{title}</Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'PlusJakartaSans-Regular',
              color: 'grey',
              marginTop: 6,
            }}>
            {text}
          </Text>
        </View>
      </View>
      {type === 'user' ? (
        <Pressable onPress={handlePressUser}>
          {loading ? (
            <View style={styles.button}>
              <ActivityIndicator size="small" color="#f55f45" />
            </View>
          ) : added ? (
            <View style={styles.button}>
              <Text style={[styles.text, {textAlign: 'center', fontSize: 15}]}>
                Sent
              </Text>
            </View>
          ) : (
            <View style={styles.button}>
              <Text style={[styles.text, {textAlign: 'center', fontSize: 15}]}>
                Add
              </Text>
            </View>
          )}
        </Pressable>
      ) : (
        <View>
          {loading ? (
            <ActivityIndicator size="small" color="#f55f45" />
          ) : requestStatus === 'deleted' ? (
            <Text style={[styles.text, {textAlign: 'center', fontSize: 15}]}>
              Deleted
            </Text>
          ) : requestStatus === 'accepted' ? (
            <Text style={[styles.text, {textAlign: 'center', fontSize: 15}]}>
              Accepted
            </Text>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: 65,
              }}>
              <Pressable onPress={() => handlePressRequest('reject')}>
                <Icon name="x" color="#B00020" size={23} />
              </Pressable>
              <Pressable onPress={() => handlePressRequest('accept')}>
                <Icon name="check" color="#0cb729" size={23} />
              </Pressable>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
};

export default ListItem2;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  button: {
    borderColor: '#9E9E9E',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 35,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 15,
    lineHeight: 18,
  },
});
