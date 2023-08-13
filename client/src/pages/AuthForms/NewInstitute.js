import React from 'react';
import {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ToastAndroid,
  Dimensions,
} from 'react-native';
import {StickyButton} from '../../components';

const NewInstitute = ({navigation, route}) => {
  const route_data = route.params;
  const [institute, setInstitute] = useState('');

  const handleSubmit = () => {
    navigation.navigate('Phone', {
      ...route_data,
      new_institute_name: institute,
    });
  };

  return (
    <View style={styles.container}>
      <StickyButton
        title="Next"
        onPress={handleSubmit}
        disabled={!institute.length}>
        <View style={styles.innerContainer}>
          <Text style={styles.header}>Enter your Institute Name</Text>
          <TextInput
            style={[styles.input]}
            value={institute}
            onChangeText={setInstitute}
            maxLength={100}
            placeholder="Name"
            placeholderTextColor="#444444"
          />
        </View>
      </StickyButton>
    </View>
  );
};

export default NewInstitute;

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
    marginBottom: 10,
  },
  text: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  input: {
    color: 'white',  
    paddingHorizontal: 20,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    lineHeight: 26,
    letterSpacing: 0.5,
    borderWidth: 1,
    borderColor: '#383838',
    borderRadius: 10,
    marginTop: 20
  },
});
