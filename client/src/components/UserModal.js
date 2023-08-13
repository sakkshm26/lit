import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Modal from 'react-native-modal';
import ProfileUserIcon from './ProfileUserIcon';
import Icon from 'react-native-vector-icons/FontAwesome5';

const UserModal = ({data, modalVisible, setModalVisible, toggleModal}) => {
  return (
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
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: -70,
          }}>
          <ProfileUserIcon
            first_name={data.first_name}
            last_name={data.last_name}
            profile_image={data.profile_image}
            imageStyle={{
              height: 120,
              width: 120,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Text
            style={[
              styles.modalText,
              {fontSize: 23, fontFamily: 'PlusJakartaSans-SemiBold'},
            ]}>
            {data?.first_name}{' '}
          </Text>
          <Text
            style={[
              styles.modalText,
              {fontSize: 23, fontFamily: 'PlusJakartaSans-SemiBold'},
            ]}>
            {data?.last_name}
          </Text>
        </View>
        <Text style={[styles.modalText]}>@{data?.username}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <Text style={[styles.modalText]}>{data?.votes} Rizz</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon
              name="university"
              color="#5a5a5a"
              size={16}
              style={{marginRight: 5}}
            />
            <Text style={[styles.modalText]}>{data?.institute_name}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon
              name="graduation-cap"
              color="#5a5a5a"
              size={14}
              style={{marginRight: 9}}
            />
            <Text style={[styles.modalText]}>{data?.year}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UserModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#c8c8c8',
    paddingTop: 12,
    paddingHorizontal: 12,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    minHeight: 300,
    paddingBottom: 20,
  },
  modalText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Regular',
  },
});
