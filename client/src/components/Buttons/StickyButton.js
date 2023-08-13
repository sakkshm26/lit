import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PrimaryButton from './PrimaryButton';

const StickyButton = ({
  children,
  title,
  onPress,
  loading = false,
  disabled,
}) => {
  return (
    <View
      style={styles.container}
      behavior={Platform.select({android: 'height', ios: 'padding'})}>
      {children}
      <PrimaryButton
        title={title}
        onPress={onPress}
        buttonStyle={{ width: "85%", paddingTop: 20 }}
        disabled={disabled}
        loading={loading}
      />
    </View>
  );
};

export default StickyButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
    alignItems: 'center',
  },
  button: {
    width: 120,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10
  },
  text: {
    fontSize: 16,
    paddingHorizontal: 5,
    paddingVertical: 10,
    textAlign: 'center',
  },
});
