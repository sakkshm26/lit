import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  ListItem2,
  ListItemSeparator,
  SearchBar,
  UserIcon,
} from '../../components';
import {AuthContext} from '../../hooks/useAuth';
import {AxiosContext} from '../../hooks/useAxios';
import debounce from 'lodash.debounce';

const FriendSearch = ({navigation}) => {
  const {authAxios} = useContext(AxiosContext);
  const {authState} = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUsersInInstitute = async () => {
    setLoading(true);
    try {
      const response = await authAxios.get(
        `/user/getlist/${authState.institute_id}/null`,
      );
      setUsers(response.data.users);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const handleSearch = async value => {
    setLoading(true);
    if (!value) {
      value = null;
    }
    try {
      const response = await authAxios.get(
        `/user/getlist/search/${authState.institute_id}/${value}`,
      );
      //   console.log(response.data.users)
      setUsers(response.data.users);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const debouncedResults = useMemo(() => {
    return debounce(handleSearch, 600);
  }, []);

  useEffect(() => {
    getUsersInInstitute();
  }, []);

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search"
        onChangeText={debouncedResults}
        searchStyle={{borderBottomWidth: 1, borderColor: '#383838'}}
      />
      {loading ? (
        <ActivityIndicator style={{flex: 1}} size="small" color="#f55f45" />
      ) : users.length ? (
        <FlatList
          contentContainerStyle
          data={users}
          renderItem={({item}) => (
            <ListItem2
              id={item.id}
              user_id={authState.id}
              title={`${item.first_name} ${item.last_name}`}
              text={item.username}
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
            />
          )}
          style={{ marginTop: 10 }}
          // ItemSeparatorComponent={<ListItemSeparator />}
        />
      ) : (
        <Text style={styles.text}>No users found</Text>
      )}
    </View>
  );
};

export default FriendSearch;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  text: {
    color: 'white',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
