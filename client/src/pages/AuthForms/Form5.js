import React from 'react';
import {useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {GradientBox, StickyButton} from '../../components';

const Form5 = ({navigation, route}) => {
  const route_data = route.params;
  const [gender, setGender] = useState(null);

  const handleSubmit = () => {
    navigation.navigate('Photo', {...route_data, gender: gender});
  };
  
  return (
    <View style={styles.container}>
      <StickyButton title="Next" onPress={handleSubmit} disabled={!gender}>
        <View style={styles.innerContainer}>
          <Text style={styles.header}>What's your gender?</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <GradientBox
              containerStyle={{
                width: Dimensions.get('window').width * 0.27,
                height: Dimensions.get('window').width * 0.27,
              }}
              iconLocation={require('../../assets/icons/male.png')}
              onPress={() => {
                setGender('MALE');
              }}
              active={gender === 'MALE'}
            />
            <GradientBox
              containerStyle={{
                width: Dimensions.get('window').width * 0.27,
                height: Dimensions.get('window').width * 0.27,
              }}
              iconLocation={require('../../assets/icons/female.png')}
              onPress={() => {
                setGender('FEMALE');
              }}
              active={gender === 'FEMALE'}
            />
            <GradientBox
              containerStyle={{
                width: Dimensions.get('window').width * 0.27,
                height: Dimensions.get('window').width * 0.27,
              }}
              iconLocation={require('../../assets/icons/non-binary.png')}
              onPress={() => {
                setGender('NON_BINARY');
              }}
              active={gender === 'NON_BINARY'}
            />
          </View>
        </View>
      </StickyButton>
    </View>
  );
};

export default Form5;

const styles = StyleSheet.create({
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
});
