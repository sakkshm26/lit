import React from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const PrimaryButton = ({title, onPress, style, buttonStyle, disabled, loading}) => {
  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={disabled}>
      <LinearGradient
        colors={disabled ? ['#1e1e1e', '#1e1e1e'] : ['#E90F44', '#e7554d', '#EC6D3A']}
        useAngle={true}
        angle={160}
        angleCenter={{x: 0.5, y: 0.5}}
        style={styles.linearGradient}>
        <Text style={[styles.text, style, {color: disabled ? "#6e6e6e" : 'black'}]}>{title}</Text>
        {loading ? <ActivityIndicator size="small" color="black"  style={{ position: "absolute", right: 30 }} /> : null}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 12,
    textAlign: 'center',
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 16,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 190,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});
