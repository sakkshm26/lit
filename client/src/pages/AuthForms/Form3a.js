import React from 'react';
import {useState} from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import {StickyButton} from '../../components';
import {states} from '../../const';

const Form3a = ({navigation, route}) => {
  const route_data = route.params;

  const [open, setOpen] = useState(false);
  const [state, setState] = useState();

  const handleSubmit = () => {
    navigation.navigate('Form2b', {...route_data, state_id: state.value});
  };

  return (
    <View style={styles.container}>
      <StickyButton title="Continue" onPress={handleSubmit} disabled={!state}>
        <View style={styles.innerContainer}>
          <Text style={styles.header}>Select Your Institute State</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#383838',
              borderRadius: 10,
            }}>
            <Pressable onPress={() => setOpen(!open)} style={styles.button}>
              {state ? (
                <Text style={styles.placeholderText}>{state.label}</Text>
              ) : (
                <Text style={[styles.placeholderText, {color: 'grey'}]}>
                  No state selected
                </Text>
              )}
              <Icon
                name={open ? 'chevron-up' : 'chevron-down'}
                color="white"
                size={16}
              />
            </Pressable>
          </View>
          {open ? (
            <View style={styles.dropdown}>
              <FlatList
                style={{overflow: 'scroll'}}
                data={states}
                nestedScrollEnabled
                renderItem={({item}) => (
                  <Pressable
                    onPress={() => {
                      setState(item);
                      setOpen(false);
                    }}
                    style={styles.dropdownOption}>
                    <Text
                      style={[
                        styles.dropdownText,
                        {
                          color:
                            item.label === state?.label ? '#f55f45' : 'white',
                        },
                      ]}>
                      {item.label}
                    </Text>
                  </Pressable>
                )}
              />
            </View>
          ) : null}
        </View>
      </StickyButton>
    </View>
  );
};

export default Form3a;

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    paddingTop: 20,
  },
  innerContainer: {
    flex: 1,
    width: '90%',
  },
  header: {
    color: 'white',
    fontSize: 19,
    fontFamily: 'PlusJakartaSans-SemiBold',
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    marginHorizontal: '8%',
    borderRadius: 5,
  },
  placeholderText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  dropdown: {
    paddingTop: 5,
    marginBottom: 120,
    paddingHorizontal: '7%',
    elevation: 5,
    borderWidth: 1,
    borderColor: '#383838',
    borderRadius: 10,
    marginTop: 20
  },
  dropdownOption: {
    paddingVertical: 20,
    marginHorizontal: 5,
    borderBottomColor: '#383838',
    borderBottomWidth: 0.5,
  },
  dropdownText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    textAlign: 'left',
  },
});
