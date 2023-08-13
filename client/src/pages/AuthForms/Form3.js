import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ListItem, ListItemSeparator, SearchBar} from '../../components';
import {AxiosContext} from '../../hooks/useAxios';
import Contacts from 'react-native-contacts';
import debounce from 'lodash.debounce';

const Form3 = ({navigation, route}) => {
  const route_data = route.params;
  const {publicAxios} = useContext(AxiosContext);
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value = null) => {
    setLoading(true);
    if (!value) {
      value = null;
    }
    try {
      const response = await publicAxios.get(
        `/getlist/institutes/${route_data.institute_type}/${route_data.state_id}/${value}`,
      );
      setInstitutes(response.data.institutes);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const debouncedResults = useMemo(() => {
    return debounce(handleSearch, 600);
  }, []);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  useEffect(() => {
    handleSearch();
  }, []);

  /* useEffect(() => {
    async function getInstitutes() {
      try {
        // await Contacts.getAll().then(data => console.log(data))
        const response = await publicAxios.get('/getlist/institutes');
        setInstitutes(response.data.institutes);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }

    getInstitutes();
  }, []); */

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pick Your Institute</Text>
      <SearchBar
        placeholder="Search"
        onChangeText={debouncedResults}
        searchStyle={{borderWidth: 1, borderColor: '#383838', borderRadius: 10}}
      />
      {loading ? (
        <ActivityIndicator style={{flex: 1}} size="small" color="#f55f45" />
      ) : (
          <FlatList
            style={{marginTop: 10}}
            nestedScrollEnabled
            data={institutes}
            renderItem={({item}) => (
              <ListItem
                key={item.id}
                title={item.name}
                text={
                  item.city?.name
                    ? `${item.city.name}, ${item.state.name}`
                    : item.state.name
                }
                rightTitle={item._count.students}
                rightText="users"
                onPress={() => {
                  navigation.navigate('Form4', {
                    ...route_data,
                    institute_id: item.id,
                  });
                }}
                style={{paddingHorizontal: 5}}
              />
            )}
            ItemSeparatorComponent={<ListItemSeparator />}
            ListFooterComponent={
              <Pressable
                onPress={() => navigation.navigate('NewInstitute', route_data)}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 30,
                  marginBottom: 40
                }}>
                <Text
                  style={[
                    styles.text,
                    {
                      color: 'white',
                      fontFamily: 'PlusJakartaSans-SemiBold',
                      fontSize: 16,
                    },
                  ]}>
                  Can't find your institute?{'  '}
                </Text>
                <Text
                  style={[
                    styles.text,
                    {
                      color: '#f55f45',
                      fontFamily: 'PlusJakartaSans-SemiBold',
                      fontSize: 16,
                    },
                  ]}>
                  Add Here
                </Text>
              </Pressable>
            }
          />
      )}

      {/* {institutes.length || loading ? (
        <View style={styles.innerContainer}>
          {institutes.map((school, id) => (
            <ListItem
              key={id}
              title={school.name}
              text={`${school.city}, ${school.state}`}
              rightTitle={school._count.students}
              rightText="users"
              onPress={() =>
                navigation.navigate('Form4', {
                  ...route_data,
                  school_id: school.id,
                })
              }
            />
          ))}
          <Text style={[styles.text, {color: '#f55f45', marginTop: 50}]}>
            more colleges coming soon!
          </Text>
        </View>
      ) : (
        <ActivityIndicator style={{flex: 1}} size="small" color="#f55f45" />
      )} */}
    </View>
  );
};

export default Form3;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: '5%',
  },
  header: {
    color: 'white',
    fontSize: 19,
    fontFamily: 'PlusJakartaSans-SemiBold',
    marginBottom: 30,
  },
  innerContainer: {
    flex: 1,
    marginTop: 15,
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
