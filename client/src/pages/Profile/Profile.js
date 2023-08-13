import React, {useEffect, useState} from 'react';
import {useContext} from 'react';
import {
  ActivityIndicator,
  Button,
  Dimensions,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import {PrimaryButton, ProfileUserIcon} from '../../components';
import {AuthContext} from '../../hooks/useAuth';
import {AxiosContext} from '../../hooks/useAxios';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Tokens from '../../components/Tokens';
import * as ImagePicker from 'react-native-image-picker';
import SecondaryButton from '../../components/Buttons/SecondaryButton';

const Profile = ({navigation}) => {
  const {logout} = useContext(AuthContext);
  const {authAxios} = useContext(AxiosContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [votes, setVotes] = useState([]);

  const getUser = async () => {
    setLoading(true);
    try {
      const response = await authAxios.get('/user/get/profile');
      setUser(response.data.user);
      setVotes(response.data.top_votes);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleUploadImage = async () => {
    try {
      await ImagePicker.launchImageLibrary(
        {
          mediaType: 'photo',
          includeBase64: false,
          maxHeight: 200,
          maxWidth: 200,
        },
        async response => {
          if (response.assets) {
            const image = response.assets[0];
            if (image.fileSize > 150000) {
              ToastAndroid.showWithGravity(
                'Image size should be less than 15 MB',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
              return;
            }

            const formData = new FormData();

            formData.append('image', {
              uri: image.uri,
              type: image.type,
              name: image.fileName,
            });

            try {
              const uploadResponse = await authAxios.post(
                `/user/image-upload`,
                formData,
                {
                  headers: {'Content-Type': 'multipart/form-data'},
                },
              );
              setUser(uploadResponse.data.user);
            } catch (err) {
              console.log('error while uploading', err);
            }
          }
        },
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {loading || !user ? (
        <ActivityIndicator style={{flex: 1}} size="small" color="#f55f45" />
      ) : (
        <View style={{paddingBottom: 30, paddingHorizontal: '5%'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 15,
              paddingBottom: 20,
            }}>
            <Text style={[styles.header, {textAlign: 'center'}]}>Profile</Text>
            <IonIcon
              name="ios-settings-outline"
              color="white"
              size={21}
              style={{position: 'absolute', right: 0, paddingLeft: 30}}
              onPress={() => navigation.navigate('Settings')}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', paddingTop: 10}}>
              <ProfileUserIcon
                first_name={user.first_name}
                last_name={user.last_name}
                profile_image={user.profile_image}
                onPress={handleUploadImage}
              />
              <Icon
                name="pen"
                color="grey"
                size={14}
                style={{position: 'absolute', left: 90, top: 5}}
              />
            </View>
            <View style={{width: '52%', justifyContent: 'space-between'}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingRight: 15,
                }}>
                <Text style={styles.text}>
                  {user._count.friends_added_by_user +
                    user._count.friends_added_user}
                  {'  '}Friends
                </Text>
                <Text style={styles.text}>
                  {user._count.votes_for_user}
                  {'  '}Rizz
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 8,
                }}>
                <Icon
                  name="university"
                  color="#5a5a5a"
                  size={16}
                  style={{marginRight: 10}}
                />
                <Text
                  style={[
                    styles.text,
                    {
                      color: '#5a5a5a',
                      lineHeight: 22,
                      fontSize: 14,
                    },
                  ]}>
                  {user.institute.name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 8,
                }}>
                <Icon
                  name="graduation-cap"
                  color="#5a5a5a"
                  size={14}
                  style={{marginRight: 9}}
                />
                <Text style={[styles.text, {color: '#5a5a5a', fontSize: 14}]}>
                  {user.year_of_study}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 30,
              justifyContent: 'space-between',
              paddingHorizontal: '14%',
            }}>
            <View style={{maxWidth: '50%'}}>
              <Text style={[styles.text]}>
                {user.first_name} {user.last_name}
              </Text>
              <Text
                style={[
                  styles.text,
                  {color: '#5a5a5a', marginTop: 6, fontSize: 13},
                ]}>
                @{user.username}
              </Text>
            </View>
            <Tokens token_count={user.tokens} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 40,
            }}>
            <Pressable
              onPress={() =>
                ToastAndroid.showWithGravity(
                  'Coming soon!',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                )
              }
              style={{
                borderWidth: 1,
                borderColor: '#9E9E9E',
                borderRadius: 35,
                flexDirection: 'row',
                paddingVertical: 12,
                width: Dimensions.get('window').width * 0.4,
                justifyContent: 'space-evenly',
              }}>
              <Text style={[styles.header, {fontSize: 14}]}>Share Profile</Text>
              <Feather name="share" color="grey" size={20} />
            </Pressable>
            <Pressable
              onPress={() =>
                ToastAndroid.showWithGravity(
                  'Coming soon!',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                )
              }
              style={{
                borderWidth: 1,
                borderColor: '#9E9E9E',
                borderRadius: 35,
                flexDirection: 'row',
                paddingVertical: 12,
                width: Dimensions.get('window').width * 0.4,
                justifyContent: 'space-evenly',
              }}>
              <Icon name="coins" color="grey" size={22} />
              <Text style={[styles.header, {fontSize: 14}]}>Shop</Text>
            </Pressable>
          </View>
          <View
            style={{
              marginTop: 40,
              flexDirection: 'column',
            }}>
            <Text
              style={[
                styles.header,
                {
                  borderBottomWidth: 1,
                  borderColor: '#262626',
                  paddingBottom: 15,
                },
              ]}>
              Top Rizz
            </Text>
            <View style={{height: 5}}></View>
            {votes.length ? (
              votes.map((vote, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 18,
                  }}>
                  <Text style={{fontSize: 25}}>{vote.emoji}</Text>
                  <Text
                    style={[
                      styles.text,
                      {
                        marginLeft: 15,
                        lineHeight: 25,
                        paddingRight: 15,
                        fontSize: 15,
                        letterSpacing: 0.2,
                      },
                    ]}>
                    {vote.text}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={[styles.text, {marginTop: 10}]}>No rizz yet</Text>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  header: {
    color: 'white',
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 18,
  },
  text: {
    color: 'white',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 15,
  },
});
