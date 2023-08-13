import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  PermissionsAndroid,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {RefreshControl} from 'react-native-gesture-handler';
import {
  InviteContact,
  ListItem2,
  ListItemSeparator,
  SearchBar,
  UserIcon,
  UserModal,
} from '../../components';
import {PrimaryButton, SecondaryButton} from '../../components/Buttons';
import {AuthContext} from '../../hooks/useAuth';
import {AxiosContext} from '../../hooks/useAxios';
import Contacts from 'react-native-contacts';

const FriendList = ({navigation}) => {
  const {authAxios} = useContext(AxiosContext);
  const {authState} = useContext(AuthContext);
  const [users, setUsers] = useState(null);
  const [requests, setRequests] = useState(null);
  const [contactsOnApp, setContactsOnApp] = useState([]);
  const [contactsOutside, setContactsOutside] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [lastUserId, setLastUserId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [permission, setPermission] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    id: '',
    first_name: '',
    last_name: '',
    username: '',
    votes: '',
    institute_name: '',
    year: '',
    profile_image: '',
  });

  const getUsersInInstitute = async () => {
    setLoadingUsers(true);
    try {
      const response = await authAxios.get(
        `/user/getlist/${authState.institute_id}/null`,
      );
      // if (response.data.users.length < 20) setHasMore(false);
      setUsers(response.data.users);
      /* if (response.data.users.length) {
          setLastUserId(response.data.users[response.data.users.length - 1].id);
        } */
      // console.log(">>>>>", response.data.users[0])
    } catch (err) {
      console.log(err);
    }
    setLoadingUsers(false);
  };

  const getFriendRequestsSent = async () => {
    setLoadingRequests(true);
    try {
      const response = await authAxios.get(
        '/friends/getlist/requests-received',
      );
      setRequests(response.data.requests);
      // console.log(">>>>>", response.data.requests[0])
    } catch (err) {
      console.log(err);
    }
    setLoadingRequests(false);
  };

  const handleRefresh = async () => {
    /* setLastUserId(null);
    setHasMore(true);
    try {
      const response = await authAxios.get(
        `/user/getlist/${authState.institute_id}/null`,
      );
      // console.log(response.data.users);
      if (response.data.users.length < 20) setHasMore(false);
      setUsers(response.data.users);
      if (response.data.users.length) {
        setLastUserId(response.data.users[response.data.users.length - 1].id);
      }
    } catch (err) {
      console.log(err);
    } */
    setRefreshing(true);
    getFriendRequestsSent();
    getUsersInInstitute();
    requestPermissionOrGetContacts();
    setRefreshing(false);
  };

  const getContacts = async () => {
    setLoadingContacts(true);
    const response = await Contacts.getAll();
    let contacts = response;
    contacts = contacts.filter(c => c?.phoneNumbers?.length);
    contacts = contacts.map(contact => ({
      first_name: contact.givenName,
      last_name: contact.familyName,
      phone: contact.phoneNumbers[0].number.includes('+91')
        ? contact.phoneNumbers[0].number
            .slice(3, contact.phoneNumbers[0].number.length)
            .replaceAll(' ', '')
        : contact.phoneNumbers[0].number.replaceAll(' ', ''),
    }));

    const apiResponse = await authAxios.post('/user/check-contacts', {
      contacts: contacts,
    });
    // console.log(">>>>>", apiResponse.data.contacts_on_app[0])
    setContactsOnApp(apiResponse.data.contacts_on_app);
    setContactsOutside(apiResponse.data.contacts_outside);
    setLoadingContacts(false);
  };

  const requestPermissionOrGetContacts = async () => {
    setLoadingPermissions(true);

    try {
      let perm = await Contacts.checkPermission();
      setPermission(perm);
      if (perm !== 'authorized') {
        try {
          const req = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          );
          if (req === 'granted') {
            getContacts();
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        getContacts();
      }
    } catch (err) {
      console.log(err);
    }

    setLoadingPermissions(false);
  };

  const handlePressUser = user => {
    setModalData({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      votes: user._count.votes_for_user,
      institute_name: user.institute.name,
      year: user.year_of_study,
      profile_image: user.profile_image
    });

    setModalVisible(true)
  };

  /* useEffect(() => {
    async function checkPermission() {
      let perm = await Contacts.checkPermission();;
      setContactPermission(perm);
      console.log('Permission', perm);
    }
    checkPermission();
  }, []); */

  useEffect(() => {
    getFriendRequestsSent();
    getUsersInInstitute();
    requestPermissionOrGetContacts();
  }, []);

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search"
        onPress={() => navigation.navigate('FriendSearch')}
        searchStyle={{borderBottomWidth: 1, borderColor: '#383838'}}
      />

      {!loadingRequests &&
      !loadingUsers &&
      !loadingContacts &&
      !requests?.length &&
      !users?.length &&
      !contactsOnApp?.length &&
      !contactsOutside?.length ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={[styles.text]}>No users found</Text>
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
      ) : null}

      {!loadingRequests && !loadingUsers ? (
        <SectionList
          contentContainerStyle
          removeClippedSubviews={true}
          windowSize={50}
          ListFooterComponent={
            permission !== 'authorized' && !loadingPermissions ? (
              <Pressable onPress={() => requestPermissionOrGetContacts()}>
                <Text
                  style={[
                    styles.text,
                    {
                      fontFamily: 'PlusJakartaSans-SemiBold',
                      paddingTop: 20,
                      paddingBottom: 40,
                    },
                  ]}>
                  Enable Contacts To Invite Friends
                </Text>
              </Pressable>
            ) : null
          }
          sections={[
            {title: 'Requests', data: requests},
            {title: 'Contacts', data: contactsOnApp},
            {title: 'From College', data: users},
            {title: 'Invite Contacts', data: contactsOutside},
          ]}
          keyExtractor={(item, index) => item + index}
          renderItem={({item, section: {title}}) =>
            title === 'Requests' ? (
              <ListItem2
                id={item.id}
                user_id={authState.id}
                title={`${item.first_name} ${item.last_name}`}
                text={`@${item.username}`}
                profile_image={item.profile_image}
                leftIcon={
                  <UserIcon
                    first_name={item.first_name}
                    last_name={item.last_name}
                    containerStyle={{
                      height: 45,
                      width: 45,
                      marginLeft: 5,
                      marginRight: 15,
                    }}
                    textStyle={{fontSize: 17}}
                  />
                }
                type="request"
                // onPress={() => handlePressUser(item)}
              />
            ) : title === 'From College' ? (
              <ListItem2
                id={item.id}
                user_id={authState.id}
                title={`${item.first_name} ${item.last_name}`}
                text={`@${item.username}`}
                profile_image={item.profile_image}
                leftIcon={
                  <UserIcon
                    first_name={item.first_name}
                    last_name={item.last_name}
                    containerStyle={{
                      height: 45,
                      width: 45,
                      marginLeft: 5,
                      marginRight: 15,
                    }}
                    textStyle={{fontSize: 17}}
                  />
                }
                type="user"
                // onPress={() => handlePressUser(item)}
              />
            ) : title === 'Contacts' ? (
              <ListItem2
                id={item.id}
                user_id={authState.id}
                title={`${item.first_name} ${item.last_name}`}
                text={`@${item.username}`}
                profile_image={item.profile_image}
                leftIcon={
                  <UserIcon
                    first_name={item.first_name}
                    last_name={item.last_name}
                    containerStyle={{
                      height: 45,
                      width: 45,
                      marginLeft: 5,
                      marginRight: 15,
                    }}
                    textStyle={{fontSize: 17}}
                  />
                }
                type="user"
                // onPress={() => handlePressUser(item)}
              />
            ) : (
              <InviteContact
                first_name={item.first_name}
                last_name={item.last_name}
                phone={item.phone}
              />
            )
          }
          renderSectionHeader={({section: {title}}) => (
            <>
              {title === 'Requests' && requests?.length ? (
                <Text
                  style={[
                    styles.text,
                    {
                      textAlign: 'left',
                      marginLeft: 25,
                      marginBottom: 10,
                      marginTop: 20,
                      fontWeight: '700',
                    },
                  ]}>
                  {title}
                </Text>
              ) : null}
              {title === 'From College' && users?.length ? (
                <Text
                  style={[
                    styles.text,
                    {
                      textAlign: 'left',
                      marginLeft: 25,
                      marginBottom: 10,
                      marginTop: 20,
                      fontWeight: '700',
                    },
                  ]}>
                  {title}
                </Text>
              ) : null}
              {title === 'Contacts' && contactsOnApp?.length ? (
                <Text
                  style={[
                    styles.text,
                    {
                      textAlign: 'left',
                      marginLeft: 25,
                      marginBottom: 10,
                      marginTop: 20,
                      fontWeight: '700',
                    },
                  ]}>
                  {title}
                </Text>
              ) : null}
              {title === 'Invite Contacts' && contactsOutside?.length ? (
                <Text
                  style={[
                    styles.text,
                    {
                      textAlign: 'left',
                      marginLeft: 25,
                      marginBottom: 10,
                      marginTop: 20,
                      fontWeight: '700',
                    },
                  ]}>
                  {title}
                </Text>
              ) : null}
            </>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          // ItemSeparatorComponent={ListItemSeparator}
        />
      ) : (
        <ActivityIndicator style={{flex: 1}} size="small" color="#f55f45" />
      )}
      <UserModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        toggleModal={() => setModalVisible(!modalVisible)}
        data={modalData}
      />
    </View>
  );
};

export default FriendList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    paddingTop: 10,
  },
  text: {
    color: 'white',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
