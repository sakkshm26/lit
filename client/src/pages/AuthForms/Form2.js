import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {StickyButton} from '../../components';
import Contacts from 'react-native-contacts';
import {useEffect} from 'react';
import SecondaryButton from '../../components/Buttons/SecondaryButton';

const Form2 = ({navigation, route}) => {
  const route_data = route.params;
  const [year, setYear] = useState(null);

  const handleSubmit = async () => {
    navigation.navigate('Form3a', {...route_data, school_year: year});
  };

  return (
    <View style={styles.container}>
      <StickyButton title="Next" onPress={handleSubmit} disabled={!year}>
        <View style={styles.innerContainer}>
          <View>
            <Text style={[styles.title, {textAlign: 'center'}]}>
              Year of education
            </Text>
            <View style={{marginTop: 30}}>
              <SecondaryButton
                title="Grade 7"
                onPress={() => setYear('GRADE_7')}
                active={year === 'GRADE_7'}
                style={{paddingVertical: 12}}
              />
              <SecondaryButton
                title="Grade 8"
                onPress={() => setYear('GRADE_8')}
                active={year === 'GRADE_8'}
                style={{paddingVertical: 12}}
              />
              <SecondaryButton
                title="Grade 9"
                onPress={() => setYear('GRADE_9')}
                active={year === 'GRADE_9'}
                style={{paddingVertical: 12}}
              />
              <SecondaryButton
                title="Grade 10"
                onPress={() => setYear('GRADE_10')}
                active={year === 'GRADE_10'}
                style={{paddingVertical: 12}}
              />
              <SecondaryButton
                title="Grade 11"
                onPress={() => setYear('GRADE_11')}
                active={year === 'GRADE_11'}
                style={{paddingVertical: 12}}
              />
              <SecondaryButton
                title="Grade 12"
                onPress={() => setYear('GRADE_12')}
                active={year === 'GRADE_12'}
                style={{paddingVertical: 12}}
              />
            </View>
          </View>
        </View>
      </StickyButton>
    </View>
  );
};

export default Form2;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  innerContainer: {
    alignItems: 'center',
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});
