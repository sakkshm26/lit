import React from 'react';
import {useContext} from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import {AxiosContext} from '../../hooks/useAxios';
import {Countdown, PollOption, PrimaryButton, Tokens} from '../../components';
import PollComplete from './PollComplete';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import PollWithoutFriends from './PollWithoutFriends';

const Home = () => {
  const [user, setUser] = useState(null);
  const {authAxios} = useContext(AxiosContext);
  const [pollStarted, setPollStarted] = useState(false);
  const [pollCompleted, setPollCompleted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [questionIndex, setQuestionIndex] = useState(0);

  const [allOptions, setAllOptions] = useState([]);
  const [visibleOptions, setVisibleOptions] = useState([]);
  const [shuffles, setShuffles] = useState(0); // can be 0, 1 and 2
  const [maxShuffles, setMaxShuffles] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null); // can be 1, 2, 3 and 4

  const [tokensEarned, setTokensEarned] = useState(0);

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
        handleStartPoll();
      }
      // user already started
    } catch (err) {
      console.log('Error', err);
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
      setAllOptions(options_response.data.options);
      setVisibleOptions(options_response.data.options.slice(0, 4));
      if (options_response.data.options.length === 4) {
        setMaxShuffles(0);
      } else if (options_response.data.options.length <= 8) {
        setMaxShuffles(1);
      } else if (options_response.data.options.length <= 12) {
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
      setAllOptions(options_response.data.options);
      setVisibleOptions(options_response.data.options.slice(0, 4));
    } catch (err) {
      console.log('Error', err);
    }
    setLoading(false);
  };

  const handlePressOption = async (id, option_num) => {
    setSelectedOption({id, option_num});
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
          user_id_to_vote: selectedOption.id,
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
      {loading || !user ? (
        <ActivityIndicator style={{flex: 1}} size="small" color="#f55f45" />
      ) : user._count.friends_added_user + user._count.friends_added_by_user <
        4 ? (
        <PollWithoutFriends user={user} />
      ) : (
        <View style={{flex: 1}}>
          {!pollStarted && !pollCompleted ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <View>
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
                      onPress={() => handleStartPoll()}
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
          ) : null}

          {pollStarted &&
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
                        handlePressOption(visibleOptions[0].id, 1);
                        Vibration.vibrate(10);
                      }}
                      selected={selectedOption?.option_num === 1}
                      first_name={visibleOptions[0].first_name}
                      last_name={visibleOptions[0].last_name}
                      profile_image={visibleOptions[0].profile_image}
                    />
                    <PollOption
                      onPress={() => {
                        handlePressOption(visibleOptions[1].id, 2);
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
                        handlePressOption(visibleOptions[2].id, 3);
                        Vibration.vibrate(10);
                      }}
                      selected={selectedOption?.option_num === 3}
                      first_name={visibleOptions[2].first_name}
                      last_name={visibleOptions[2].last_name}
                      profile_image={visibleOptions[2].profile_image}
                    />
                    <PollOption
                      onPress={() => {
                        handlePressOption(visibleOptions[3].id, 4);
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
                  <Pressable style={styles.button} onPress={() => handleAnswer('answer')}>
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
          ) : null}
          {pollCompleted ? (
            <PollComplete
              total_token_count={user.tokens}
              tokens_earned={tokensEarned}
              setPollCompleted={setPollCompleted}
              getUser={getUser}
            />
          ) : null}
        </View>
      )}
    </View>
  );
};

export default Home;

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
