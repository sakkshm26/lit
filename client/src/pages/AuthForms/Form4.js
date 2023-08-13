import React, {useContext, useEffect} from 'react';
import {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Button, FAB} from 'react-native-paper';
import {ListItem, ListItemSeparator, UserIcon} from '../../components';
import {AxiosContext} from '../../hooks/useAxios';

const Form4 = ({navigation, route}) => {
  const route_data = route.params;
  const {publicAxios} = useContext(AxiosContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friendIds, setFriendIds] = useState(new Set());
  const [lastUserId, setLastUserId] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const handleFriends = friend_id => {
    if (friendIds.has(friend_id)) {
      let temp = new Set(friendIds);
      temp.delete(friend_id);
      setFriendIds(new Set(temp));
    } else {
      let temp = new Set(friendIds);
      temp.add(friend_id);
      setFriendIds(new Set(temp));
    }
  };

  const getUsersInInstitute = async () => {
    setLoading(true);
    if (hasMore) {
      try {
        const response = await publicAxios.get(
          `/getlist/institute/users/${route_data.institute_id}/${lastUserId}`,
        );
        console.log(response.data);
        if (!response.data.users.length) setHasMore(false);
        else {
          setUsers(prev => [...prev, ...response.data.users]);
          setLastUserId(response.data.users[response.data.users.length - 1].id);
          // setLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log('Complete data fetched');
    }
    setLoading(false);
  };

  useEffect(() => {
    getUsersInInstitute();
  }, []);

  return (
    <>
      <View style={styles.container}>
      <Text style={styles.header}>Add Friends</Text>
        {!users.length && !loading ? (
          <Text style={styles.text}>No users found in the institute</Text>
        ) : users.length || !loading ? (
          <FlatList
            contentContainerStyle
            data={users}
            renderItem={({item}) => (
              <ListItem
                title={`${item.first_name} ${item.last_name}`}
                text={`@${item.username}`}
                profile_image={item.profile_image}
                rightIcon={true}
                leftIcon={
                  <UserIcon
                    first_name={item.first_name}
                    last_name={item.last_name}
                    containerStyle={{
                      height: 45,
                      width: 45,
                      marginRight: 15,
                    }}
                    textStyle={{fontSize: 16}}
                  />
                }
                onPress={() => handleFriends(item.id)}
              />
            )}
            ItemSeparatorComponent={<ListItemSeparator />}
            onEndReachedThreshold={0.2}
            onEndReached={() => getUsersInInstitute()}
          />
        ) : (
          <ActivityIndicator style={{flex: 1}} size="small" color="#f55f45" />
        )}
      </View>
      {/* <Button icon="arrow-right" /> */}
      <FAB
        icon="arrow-right"
        color="#f55f45"
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          backgroundColor: 'black',
          borderRadius: 100,
        }}
        onPress={() =>
          navigation.navigate('Phone', {
            ...route_data,
            friend_ids: Array.from(friendIds),
          })
        }
      />
    </>
  );
};

export default Form4;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: "5%",
    paddingBottom: 60
  },
  header: {
    color: 'white',
    fontSize: 19,
    fontFamily: 'PlusJakartaSans-SemiBold',
    marginBottom: 20,
  },
  collegeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderColor: '#3f3f3f',
  },
  text: {
    color: 'white',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#B00020',
    fontFamily: 'PlusJakartaSans-Regular',
    marginTop: 20,
  },
});
