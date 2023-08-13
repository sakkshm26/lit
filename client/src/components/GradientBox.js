import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from "react-native-linear-gradient"

const GradientBox = ({iconLocation, title, onPress, active, containerStyle}) => {
  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        style={[{
          borderRadius: 15,
          height: 150,
          width: 150,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: active ? '#383838' : null,
        }, containerStyle]}
        colors={['#2f2f2f', '#040404']}
        useAngle={true}
        angle={160}
        angleCenter={{x: 0.1, y: 0.1}}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Image
            source={iconLocation}
            style={title==="School" ? {height: 38, width: 38} : {height: 48, width: 48}}
          />
          {title ? <Text style={[styles.text, {textAlign: 'center', marginTop: title === 'School' ? 17 : 10}]}>
            {title}
          </Text> : null}
        </View>
      </LinearGradient>
    </Pressable>
  );
};

export default GradientBox;


export const styles = StyleSheet.create({
    text: {
      color: 'white',
      fontSize: 14,
      fontFamily: 'PlusJakartaSans-Regular',
    },
  });