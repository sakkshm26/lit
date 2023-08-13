import React, {useLayoutEffect} from 'react';
import {useState} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import {GradientBox, StickyButton} from '../../components';
import Icon from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'react-native-image-picker';

const Photo = ({navigation, route}) => {
  const route_data = route.params;
  const [imageUri, setImageUri] = useState();
  const [imageData, setImageData] = useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => navigation.navigate('Form5b', {...route_data, image_data: imageData})}>
          <Text style={[styles.text, {paddingHorizontal: 20}]}>Skip</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  const handleUploadImage = async () => {
    try {
      await ImagePicker.launchImageLibrary(
        {
          mediaType: 'photo',
          includeBase64: false,
          maxHeight: 200,
          maxWidth: 200,
        },
        async response => {
          if (response.assets) {
            const image = response.assets[0];
            if (image.fileSize > 150000) {
              ToastAndroid.showWithGravity(
                'Image size should be less than 15 MB',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
              return;
            }

            const formData = new FormData();

            formData.append('image', {
              uri: image.uri,
              type: image.type,
              name: image.fileName,
            });

            setImageData(formData);
            setImageUri(image.uri);
          }
        },
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = () => {
    navigation.navigate('Form5b', {...route_data, image_data: imageData});
  };

  return (
    <View style={styles.container}>
      <StickyButton title="Next" onPress={handleSubmit} disabled={!imageData}>
        <View style={styles.innerContainer}>
          <Text style={styles.header}>Add a profile photo</Text>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 80,
            }}>
            <Pressable
              style={{flexDirection: 'row', marginBottom: 30}}
              onPress={handleUploadImage}>
              {imageUri ? (
                <Image
                  source={{uri: imageUri}}
                  style={{height: 100, width: 100, borderRadius: 20}}
                />
              ) : (
                <Icon name="user" size={100} color="grey" />
              )}

              <Icon
                name="camera"
                color="white"
                size={20}
                style={{
                  position: 'absolute',
                  right: -15,
                  bottom: -15,
                  backgroundColor: 'black',
                  padding: 15,
                  borderRadius: 50,
                }}
              />
            </Pressable>
            <Text style={[styles.text, {color: 'grey'}]}>
              Add a photo so your friends can find you
            </Text>
          </View>
        </View>
      </StickyButton>
    </View>
  );
};

export default Photo;

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
  text: {
    color: 'white',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
  },
});
