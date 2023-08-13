import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  PermissionsAndroid,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import {AxiosContext} from '../../hooks/useAxios';
import Contacts from 'react-native-contacts';
import {Countdown, PollOption, PrimaryButton} from '../../components';
import PollComplete from './PollComplete';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';

const PollWithoutFriends = () => {
  const [user, setUser] = useState(null);
  const {authAxios} = useContext(AxiosContext);
  const [pollStarted, setPollStarted] = useState(false);
  const [pollCompleted, setPollCompleted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [allOptions, setAllOptions] = useState([]);
  const [visibleOptions, setVisibleOptions] = useState([]);
  const [shuffles, setShuffles] = useState(0);
  const [maxShuffles, setMaxShuffles] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [permission, setPermission] = useState();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingPermission, setLoadingPermission] = useState(false);
  const [tokensEarned, setTokensEarned] = useState(0);

  const getContacts = async () => {
    setLoading(true);

    try {
      const response = await Contacts.getAll();
      let fetched_contacts = response;
      fetched_contacts = fetched_contacts.filter(c => c?.phoneNumbers?.length);
      fetched_contacts = fetched_contacts.map(contact => ({
        first_name: contact.givenName,
        last_name: contact.familyName,
        phone: contact.phoneNumbers[0].number.includes('+91')
          ? contact.phoneNumbers[0].number
              .slice(3, contact.phoneNumbers[0].number.length)
              .replaceAll(' ', '')
          : contact.phoneNumbers[0].number.replaceAll(' ', ''),
      }));
      let temp = _.sampleSize(fetched_contacts, 50);
      setContacts(temp);
      setLoading(false);
      return temp;
    } catch (err) {
      console.log(err);
    }
  };

  const requestPermission = async type => {
    setLoadingPermission(true);
    try {
      let perm = await Contacts.checkPermission();
      //   console.log(perm);
      setPermission(perm);
      if (perm !== 'authorized') {
        try {
          const req = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          );
          if (req === 'granted') {
            setPermission('authorized');
            handleStartPoll();
          }
        } catch (err) {
          console.log(err);
        }
      } else handleStartPoll();
    } catch (err) {
      console.log(err);
    }
    setLoadingPermission(false);
  };

  const handleShuffle = () => {
    if ((allOptions.length <= 8) & (allOptions.length !== 4)) {
      setShuffles(prev => prev + 1);
      setVisibleOptions(
        allOptions.slice(allOptions.length - 4, allOptions.length),
      );
    } else if (allOptions.length > 8 && shuffles === 0) {
      setShuffles(prev => prev + 1);
      setVisibleOptions(allOptions.slice(4, 8));
    } else {
      setShuffles(prev => prev + 1);
      setVisibleOptions(
        allOptions.slice(allOptions.length - 4, allOptions.length),
      );
    }
  };

  const getUser = async () => {
    setLoading(true);
    try {
      const response = await authAxios.get('/user/get');
      // console.log('user', response.data.user);
      setUser(response.data.user);
      if (response.data.user.poll.questions_viewed_num) {
        setQuestionIndex(response.data.user.poll.questions_viewed_num);
      }
      if (response.data.user.poll.available) {
        requestPermission();
      }
    } catch (err) {
      console.log('Error fetching user', err);
    }
    setLoading(false);
  };

  const handleStartPoll = async () => {
    setLoading(true);
    try {
      if (user?.poll?.questions.length) setQuestions(user.poll.questions);
      else {
        const response = await authAxios.get('/poll/questions');
        setQuestions(response.data.poll.questions);
      }
      const options_response = await authAxios.get('/poll/options');
      let get_contacts = await getContacts();
      get_contacts = _.shuffle(get_contacts);
      let all_options = [...options_response.data.options, ...get_contacts];
      setAllOptions(all_options);
      setVisibleOptions(all_options.slice(0, 4));
      if (all_options.length === 4) {
        setMaxShuffles(0);
      } else if (all_options.length <= 8) {
        setMaxShuffles(1);
      } else if (all_options.length > 8) {
        setMaxShuffles(2);
      }
      setPollStarted(true);
    } catch (err) {
      console.log('Error', err);
    }
    setLoading(false);
  };

  const handleChangeQuestion = async () => {
    setLoading(true);
    setShuffles(0);
    setQuestionIndex(prev => prev + 1);
    try {
      const options_response = await authAxios.get('/poll/options');
      let shuffled_contacts = _.shuffle(contacts);
      let all_options = [
        ...options_response.data.options,
        ...shuffled_contacts,
      ];
      setAllOptions(all_options);
      setVisibleOptions(all_options.slice(0, 4));
    } catch (err) {
      console.log('Error', err);
    }
    setLoading(false);
  };

  const handlePressOption = async (id, phone, option_num) => {
    setSelectedOption({id, phone, option_num});
  };

  const handleAnswer = async type => {
    setLoading(true);

    try {
      let formatted_data = {question_num: questionIndex + 1};
      if (type === 'skip') {
        formatted_data = {...formatted_data, skip: true};
      } else {
        formatted_data = {
          ...formatted_data,
          user_id_to_vote: selectedOption.id || null,
          phone: selectedOption.phone,
          question_id: questions[questionIndex].id,
          option1: `${visibleOptions[0].first_name} ${visibleOptions[0].last_name}`,
          option2: `${visibleOptions[1].first_name} ${visibleOptions[1].last_name}`,
          option3: `${visibleOptions[2].first_name} ${visibleOptions[2].last_name}`,
          option4: `${visibleOptions[3].first_name} ${visibleOptions[3].last_name}`,
        };
        setSelectedOption(null);
      }
      const response = await authAxios.post('/poll/answer', formatted_data);

      if (questionIndex === 11) {
        setPollStarted(false);
        setTokensEarned(response.data.tokens_earned);
        setPollCompleted(true);
        setQuestions([]);
        setQuestionIndex(0);
        setAllOptions([]);
        setVisibleOptions([]);
      } else handleChangeQuestion();
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <View style={styles.container}>
      {permission === 'authorized' ? (
        loading || loadingPermission || !user ? (
          <ActivityIndicator style={{flex: 1}} size="small" color="#f55f45" />
        ) : user._count.friends_added_user +
            user._count.friends_added_by_user +
            contacts.length <
          4 ? (
          <Text
            style={[
              styles.text,
              {
                fontFamily: 'PlusJakartaSans-Regular',
                fontSize: 18,
                lineHeight: 30,
              },
            ]}>
            Add more friends or contacts to start playing
          </Text>
        ) : pollStarted &&
          !pollCompleted &&
          allOptions.length &&
          questions.length ? (
          <View style={styles.poll}>
            <View>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: 16,
                    fontFamily: 'PlusJakartaSans-SemiBold',
                    marginTop: -30,
                  },
                ]}>
                {questionIndex + 1}/12
              </Text>
              <Text style={styles.emojiText}>
                {questions[questionIndex].emoji}
              </Text>
              <Text style={styles.questionText}>
                {questions[questionIndex].text}
              </Text>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 40,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <PollOption
                    onPress={() => {
                      handlePressOption(
                        visibleOptions[0].id,
                        visibleOptions[0].phone,
                        1,
                      );
                      Vibration.vibrate(10);
                    }}
                    selected={selectedOption?.option_num === 1}
                    first_name={visibleOptions[0].first_name}
                    last_name={visibleOptions[0].last_name}
                    profile_image={visibleOptions[0].profile_image}
                  />
                  <PollOption
                    onPress={() => {
                      handlePressOption(
                        visibleOptions[1].id,
                        visibleOptions[1].phone,
                        2,
                      );
                      Vibration.vibrate(10);
                    }}
                    selected={selectedOption?.option_num === 2}
                    first_name={visibleOptions[1].first_name}
                    last_name={visibleOptions[1].last_name}
                    profile_image={visibleOptions[1].profile_image}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <PollOption
                    onPress={() => {
                      handlePressOption(
                        visibleOptions[2].id,
                        visibleOptions[2].phone,
                        3,
                      );
                      Vibration.vibrate(10);
                    }}
                    selected={selectedOption?.option_num === 3}
                    first_name={visibleOptions[2].first_name}
                    last_name={visibleOptions[2].last_name}
                    profile_image={visibleOptions[2].profile_image}
                  />
                  <PollOption
                    onPress={() => {
                      handlePressOption(
                        visibleOptions[3].id,
                        visibleOptions[3].phone,
                        4,
                      );
                      Vibration.vibrate(10);
                    }}
                    selected={selectedOption?.option_num === 4}
                    first_name={visibleOptions[3].first_name}
                    last_name={visibleOptions[3].last_name}
                    profile_image={visibleOptions[3].profile_image}
                  />
                </View>
              </View>
            </View>
            {selectedOption ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <Text style={[styles.buttonText]}></Text>
                <Pressable
                  style={styles.button}
                  onPress={() => handleAnswer('answer')}>
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        fontFamily: 'PlusJakartaSans-SemiBold',
                        color: '#f55f45',
                      },
                    ]}>
                    Next
                  </Text>
                  <MaterialIcon
                    name="arrow-right"
                    color="#f55f45"
                    size={30}
                    style={{marginBottom: -5, marginLeft: -10}}
                  />
                </Pressable>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}>
                <TouchableOpacity
                  onPress={() => handleShuffle()}
                  disabled={maxShuffles === shuffles}
                  style={styles.button}>
                  <Text
                    style={
                      maxShuffles === shuffles
                        ? [styles.buttonText, {color: 'grey'}]
                        : styles.buttonText
                    }>
                    Shuffle
                  </Text>
                  <IonIcon
                    name="ios-shuffle"
                    color="grey"
                    size={25}
                    style={{marginBottom: -5}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleAnswer('skip')}
                  style={styles.button}>
                  <Text style={styles.buttonText}>Skip</Text>
                  <MaterialIcon
                    name="fast-forward"
                    color="grey"
                    size={25}
                    style={{marginBottom: -5}}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : pollCompleted ? (
          <PollComplete
            total_token_count={user.tokens}
            tokens_earned={tokensEarned}
            setPollCompleted={setPollCompleted}
            getUser={getUser}
          />
        ) : (
          <Countdown
            last_completed_date={user.poll.last_completed_date}
            getUser={getUser}
          />
        )
      ) : !pollStarted && !pollCompleted && user ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{flex: 1}}>
            {user.poll.available ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  name="lock-open"
                  size={100}
                  color="grey"
                  style={{marginBottom: 60}}
                />
                <PrimaryButton
                  title="Start the poll"
                  onPress={() => requestPermission()}
                />
              </View>
            ) : (
              <Countdown
                last_completed_date={user.poll.last_completed_date}
                getUser={getUser}
              />
            )}
          </View>
        </View>
      ) : user ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            paddingHorizontal: 15,
          }}>
          <Text
            style={[
              styles.text,
              {
                fontFamily: 'PlusJakartaSans-Regular',
                fontSize: 18,
                lineHeight: 30,
              },
            ]}>
            Please enable access to contacts or add{' '}
            {user?._count.friends_added_user +
              user?._count.friends_added_by_user}{' '}
            more friends to start playing
          </Text>
          <View style={{height: 30}}></View>
          <PrimaryButton
            title="Enable Contacts"
            style={{marginTop: 30}}
            onPress={() => requestPermission()}
          />
        </View>
      ) : (
        <ActivityIndicator style={{flex: 1}} size="small" color="#f55f45" />
      )}
    </View>
  );
};

export default PollWithoutFriends;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'space-evenly',
  },
  poll: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  emojiText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 50,
    marginTop: '10%',
  },
  questionText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 35,
    marginTop: 40,
    paddingHorizontal: 6,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledText: {
    color: 'grey',
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'PlusJakartaSans-SemiBold',
    marginRight: 5,
  },
});
