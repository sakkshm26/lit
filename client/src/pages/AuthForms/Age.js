import React, {useRef, useState} from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import Picker from '@wave909/react-native-ios-scroll-picker';
import {
  FlatList,
  GestureHandlerRootView,
  NativeViewGestureHandler,
  ScrollView,
} from 'react-native-gesture-handler';
import {MaskedElement, MaskedView, StickyButton} from '../../components';
import Carousel from 'react-native-snap-carousel';
import {ageList} from '../../const';

const SLIDER_WIDTH = Dimensions.get('window').width + 80;

const Age = ({navigation, route}) => {
  const route_data = route.params;
  const [currentAge, setCurrentAge] = useState(16);
  const [ages, setAges] = useState(ageList);
  const isCarousel = useRef(null);

  const handleSubmit = () => {
    if (currentAge < 13) {
      ToastAndroid.showWithGravity(
        'You must be at least 13 years old to use this app',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
    } else {
      navigation.navigate('Form6', {...route_data, age: currentAge});
    }
  };

  return (
    <View style={styles.container}>
      <StickyButton title="Continue" onPress={handleSubmit}>
        <View style={styles.innerContainer}>
          {/* <View style={{height: 300}}>
            <MaskedView element={<MaskedElement />}>
              <FlatList
                data={ages}
                renderItem={({item}) => (
                  <Pressable onPress={() => setCurrentAge(item.value)}>
                    <Text
                      style={[
                        styles.text,
                        {color: currentAge === item.label ? 'red' : 'white'},
                      ]}>
                      {item.label}
                    </Text>
                  </Pressable>
                )}
              />
            </MaskedView>
          </View> */}
          <Text style={styles.header}>How Old Are You?</Text>
          <NativeViewGestureHandler disallowInterruption={true}>
            <View style={{alignItems: 'center', flex: 1}}>
              <Carousel
                ref={isCarousel}
                data={ages}
                renderItem={({item, index}) => (
                  <Text style={styles.text}>{item.label}</Text>
                )}
                onSnapToItem={index => setCurrentAge(index + 1)}
                sliderWidth={Dimensions.get('window').width *0.90 }
                itemWidth={60}
                useScrollView
                activeSlideAlignment="center"
                activeSlideOffset={500}
                inactiveSlideScale={0.98}
                inactiveSlideOpacity={0.3}
                firstItem={15}
              />
            </View>
          </NativeViewGestureHandler>
        </View>
      </StickyButton>
    </View>
  );
};

export default Age;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    flexDirection: 'row',
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
    fontSize: 38,
    textAlign: 'center',
    color: 'white',
    letterSpacing: -5,
  },
});
