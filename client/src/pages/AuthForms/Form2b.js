import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import {GradientBox, StickyButton} from '../../components';
import DegreeYear from '../../components/Buttons/DegreeYear';
import SecondaryButton from '../../components/Buttons/SecondaryButton';
import LinearGradient from 'react-native-linear-gradient';

const Form2b = ({navigation, route}) => {
  const route_data = route.params;
  const [instituteType, setInstituteType] = useState(null);
  const [degreeType, setDegreeType] = useState(null);
  const [year, setYear] = useState(null);

  const handleSubmit = () => {
    navigation.navigate('Form3', {
      ...route_data,
      year_of_study: year,
      institute_type: instituteType,
    });
  };

  return (
    <View style={styles.container}>
      <StickyButton
        title="Continue"
        onPress={handleSubmit}
        disabled={!(degreeType ? degreeType && year : year)}>
        <ScrollView style={styles.innerContainer}>
          <Text style={styles.header}>Select Your Institute</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <GradientBox
              iconLocation={require('../../assets/icons/school.png')}
              title="School"
              onPress={() => {
                setInstituteType('SCHOOL');
                setDegreeType(null);
                setYear(null);
              }}
              active={instituteType === 'SCHOOL'}
              containerStyle={{
                width: Dimensions.get('window').width * 0.4,
                height: Dimensions.get('window').width * 0.37,
              }}
            />
            <GradientBox
              iconLocation={require('../../assets/icons/college.png')}
              title="College"
              onPress={() => {
                setInstituteType('COLLEGE');
                setDegreeType(null);
                setYear(null);
              }}
              active={instituteType === 'COLLEGE'}
              containerStyle={{
                width: Dimensions.get('window').width * 0.4,
                height: Dimensions.get('window').width * 0.37,
              }}
            />
          </View>
          <View style={{marginTop: 50, paddingBottom: 30}}>
            {instituteType === 'SCHOOL' ? (
              <>
                <Text style={[styles.header]}>Select your grade</Text>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    // alignItems: 'center',
                    // marginTop: 30,
                    flexWrap: 'wrap',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <DegreeYear
                      title="7th"
                      onPress={() => setYear('GRADE_7')}
                      active={year === 'GRADE_7'}
                    />
                    <DegreeYear
                      title="8th"
                      onPress={() => setYear('GRADE_8')}
                      active={year === 'GRADE_8'}
                    />
                    <DegreeYear
                      title="9th"
                      onPress={() => setYear('GRADE_9')}
                      active={year === 'GRADE_9'}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 15,
                    }}>
                    <DegreeYear
                      title="10th"
                      onPress={() => setYear('GRADE_10')}
                      active={year === 'GRADE_10'}
                    />
                    <DegreeYear
                      title="11th"
                      onPress={() => setYear('GRADE_11')}
                      active={year === 'GRADE_11'}
                    />
                    <DegreeYear
                      title="12th"
                      onPress={() => setYear('GRADE_12')}
                      active={year === 'GRADE_12'}
                    />
                  </View>
                </View>
              </>
            ) : instituteType === 'COLLEGE' ? (
              <>
                <Text style={[styles.header]}>Select your degree</Text>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    // alignItems: 'center',
                    // marginTop: 30,
                    // flexWrap: 'wrap',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <SecondaryButton
                      title="Bachelors"
                      onPress={() => {
                        setDegreeType('Bachelors');
                        setYear(null);
                      }}
                      active={degreeType === 'Bachelors'}
                      style={{
                        width: Dimensions.get('window').width * 0.4,
                        borderRadius: 8,
                      }}
                      textStyle={{fontFamily: 'PlusJakartaSans-SemiBold'}}
                    />
                    <SecondaryButton
                      title="Masters"
                      onPress={() => {
                        setDegreeType('Masters');
                        setYear(null);
                      }}
                      active={degreeType === 'Masters'}
                      style={{
                        width: Dimensions.get('window').width * 0.4,
                        borderRadius: 8,
                      }}
                      textStyle={{fontFamily: 'PlusJakartaSans-SemiBold'}}
                    />
                  </View>
                  {degreeType === 'Bachelors' ? (
                    <View
                      style={{marginTop: 30, justifyContent: 'space-between'}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View style={{ flexDirection: 'column' }}>
                          <DegreeYear
                            title="1st"
                            onPress={() => setYear('BACHELOR_FIRST')}
                            active={year === 'BACHELOR_FIRST'}
                          />
                          <DegreeYear
                            title="4th"
                            onPress={() => setYear('BACHELOR_FOURTH')}
                            active={year === 'BACHELOR_FOURTH'}
                            style={{ marginTop: 15 }}
                          />
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                          <DegreeYear
                            title="2nd"
                            onPress={() => setYear('BACHELOR_SECOND')}
                            active={year === 'BACHELOR_SECOND'}
                          />
                          <DegreeYear
                            title="5th"
                            onPress={() => setYear('BACHELOR_FIFTH')}
                            active={year === 'BACHELOR_FIFTH'}
                            style={{ marginTop: 15 }}
                          />
                        </View>
                        <DegreeYear
                          title="3rd"
                          onPress={() => setYear('BACHELOR_THIRD')}
                          active={year === 'BACHELOR_THIRD'}
                        />
                      </View>
                    </View>
                  ) : degreeType === 'Masters' ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 30,
                      }}>
                      <DegreeYear
                        title="1st"
                        onPress={() => setYear('MASTER_FIRST')}
                        active={year === 'MASTER_FIRST'}
                      />
                      <DegreeYear
                        title="2nd"
                        onPress={() => setYear('MASTER_SECOND')}
                        active={year === 'MASTER_SECOND'}
                      />
                      <DegreeYear
                        title="3rd"
                        onPress={() => setYear('MASTER_THIRD')}
                        active={year === 'MASTER_THIRD'}
                      />
                    </View>
                  ) : null}
                </View>
              </>
            ) : null}
          </View>
        </ScrollView>
      </StickyButton>
    </View>
  );
};

export default Form2b;

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
  text: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
  },
});
