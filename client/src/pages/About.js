import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const About = () => {
    return (
        <View style={styles.container}>
            <Text>This is about page!</Text>
        </View>
    )
}

export default About

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'black',
      flex: 1,
      alignItems: 'center',
      paddingTop: 60,
    },
    formContainer: {
      alignItems: 'center',
      flex: 1,
    },
    errorText: {
      color: '#B00020',
      fontFamily: 'PlusJakartaSans-Regular',
    },
  });