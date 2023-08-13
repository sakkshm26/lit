import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {PrimaryButton, StickyButton} from '../../components';

const Form7 = ({navigation, route}) => {
  const route_data = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View>
          <Text style={[styles.title, {textAlign: 'center'}]}>
            Choose your education level
          </Text>
          <View style={{marginTop: 60, alignItems: 'center'}}>
            <PrimaryButton
              title="School"
              onPress={() => navigation.navigate('Form2', {...route_data, institute_type: 'SCHOOL'})}
            />
            <PrimaryButton
              title="College"
              style={{marginTop: 30}}
              onPress={() => navigation.navigate('Form2b', {...route_data, institute_type: 'COLLEGE'})}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Form7;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    alignItems: 'center',
  },
  innerContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginBottom: 160,
  },
  title: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  option: {
    padding: 15,
    margin: 10,
    width: 150,
    borderColor: '#3f3f3f',
    borderWidth: 1,
    borderRadius: 5,
  },
  optionText: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'PlusJakartaSans-Regular',
    textAlign: 'center',
  },
  errorText: {
    color: '#B00020',
    fontFamily: 'PlusJakartaSans-Regular',
    marginTop: 30,
  },
});
