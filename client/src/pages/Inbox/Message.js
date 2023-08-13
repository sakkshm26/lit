import React, {useContext, useEffect} from 'react';
import {useState} from 'react';
import {
  DeviceEventEmitter,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import {PollOption} from '../../components';
import ViewShot from 'react-native-view-shot';
import {useRef} from 'react';
import Share from 'react-native-share';
import Modal from 'react-native-modal';
import {AxiosContext} from '../../hooks/useAxios';
import IonIcon from 'react-native-vector-icons/Ionicons';

const Message = ({route, remainingHints, setRemainingHints}) => {
  const {poll, revealed, viewed, vote_id, index} = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const viewShotRef = useRef();
  const {authAxios} = useContext(AxiosContext);
  const [hint, setHint] = useState();
  const [tempRevealed, setTempRevealed] = useState(false);
  const [viewShotHide, setViewShotHide] = useState(false);

  const toggleModal = async () => {
    if (modalVisible) {
      setModalVisible(false);
    } else {
      if (remainingHints || poll.revealed || revealed || tempRevealed) {
        if (poll.revealed || revealed || tempRevealed) {
          setModalVisible(true);
          setHint(poll.created_by_initial_letter);
        } else {
          try {
            const response = await authAxios.post('/poll/reveal', {
              vote_id: poll.id,
              remaining_hints: remainingHints,
            });
            DeviceEventEmitter.emit('test', {index: index, type: 'reveal'});
            setTempRevealed(true);
            setHint(response.data.hint);
            setModalVisible(true);
            if (!response.data.already_revealed) {
              setRemainingHints(prev => prev - 1);
            }
          } catch (err) {
            console.log(err);
          }
        }
      } else {
        ToastAndroid.showWithGravity(
          'You have crossed the daily limit for hints',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      }
    }
  };

  const captureViewShot = async () => {
    setViewShotHide(true);
    try {
      const imageURI = await viewShotRef.current.capture();
      try {
        const response = await Share.open({
          url: 'data:image/png;base64,' + imageURI,
          type: 'image/png',
        });
        console.log('success', response.data);
      } catch (err) {
        console.log('Error occurred', err);
        ToastAndroid.showWithGravity(
          'Please provide the required permission on the app you are sharing',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      }
    } catch (err) {
      console.log('Error occurred', err);
    }
    setViewShotHide(false);
  };

  useEffect(() => {
    async function viewMessage() {
      try {
        const response = await authAxios.post('/user/update/message', {
          vote_id,
        });
        DeviceEventEmitter.emit('test', {index: index, type: 'view'});
        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    }

    if (!viewed) {
      viewMessage();
    }
  }, []);

  return (
    <View style={styles.container}>
      <ViewShot
        ref={viewShotRef}
        style={{flex: 1, justifyContent: 'space-evenly', alignItems: 'center'}}
        options={{format: 'png', quality: 1.0, result: 'base64'}}>
        <Text style={[styles.text, {fontSize: 14}]}>{poll.message}</Text>
        {!viewShotHide ? <Text style={styles.emojiText}>{poll.question.emoji}</Text> : null}
        <Text style={styles.questionText}>{poll.question.text}</Text>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <PollOption
              message={true}
              selected={poll.created_for === poll.option1}
              full_name={poll.option1}
            />
            <PollOption
              message={true}
              selected={poll.created_for === poll.option2}
              full_name={poll.option2}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <PollOption
              message={true}
              selected={poll.created_for === poll.option3}
              full_name={poll.option3}
            />
            <PollOption
              message={true}
              selected={poll.created_for === poll.option4}
              full_name={poll.option4}
            />
          </View>
        </View>
        {!viewShotHide ? (
          <Pressable
            style={{
              backgroundColor: '#1b1b1b',
              height: 60,
              width: '84%',
              borderRadius: 15,
              justifyContent: 'center',
            }}
            onPress={() => captureViewShot()}>
            <Text style={[styles.text, {fontFamily: 'PlusJakartaSans-SemiBold'}]}>
              Share
            </Text>
          </Pressable>
        ) : null}
        {!viewShotHide ? (
          <Pressable
            style={{
              backgroundColor: '#1b1b1b',
              height: 60,
              width: '84%',
              borderRadius: 15,
              justifyContent: 'center'
            }}
            onPress={() => toggleModal()}>
            <Text style={[styles.text, {fontFamily: 'PlusJakartaSans-SemiBold'}]}>
              Who sent this?
            </Text>
            <Text style={[styles.text, {fontSize: 13}]}>
              {remainingHints} hints remaining
            </Text>
          </Pressable>
        ) : null}
        {viewShotHide ? (
          <Text style={[styles.text, {fontSize: 14}]}>
            lit-app.in
          </Text>
        ) : null}
      </ViewShot>
      <Modal
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        isVisible={modalVisible}
        swipeDirection="down"
        onSwipeComplete={toggleModal}
        animationInTiming={300}
        animationOutTiming={500}
        backdropTransitionInTiming={800}
        backdropTransitionOutTiming={800}
        useNativeDriver={true}
        style={styles.modal}>
        <View style={styles.modalContent}>
          <View>
            <Text style={[styles.text, {fontSize: 15}]}>
              Initial letter of the first name is
            </Text>
            <Text style={[styles.text, {fontSize: 35, color: '#f55f45'}]}>
              {hint}
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={{
                marginTop: 40,
                marginLeft: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#bfbfbf',
                paddingVertical: 5,
                width: 70,
                borderRadius: 5,
              }}>
              <Text
                style={[
                  styles.text,
                  {
                    fontFamily: 'PlusJakartaSans-SemiBold',
                    color: 'black',
                    fontSize: 14,
                  },
                ]}>
                Back
              </Text>
            </Pressable>
            <Pressable
              onPress={() => captureViewShot()}
              style={{
                marginTop: 40,
                marginLeft: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                paddingVertical: 5,
                width: 70,
                borderRadius: 5,
              }}>
              <Text
                style={[
                  styles.text,
                  {
                    fontFamily: 'PlusJakartaSans-SemiBold',
                    color: 'black',
                    fontSize: 14,
                  },
                ]}>
                Share
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'space-evenly',
    marginTop: -20
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  emojiText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 50,
  },
  questionText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 19,
    lineHeight: 35,
    paddingHorizontal: 6,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#0e0e0e',
    paddingTop: 12,
    paddingHorizontal: 12,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    minHeight: 240,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
