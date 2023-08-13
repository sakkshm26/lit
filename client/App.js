import 'react-native-gesture-handler';
import React from 'react';
import {
  Alert,
  BackHandler,
  Linking,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {AuthProvider, AxiosProvider} from './src/hooks/index';
import {MainRouter} from './src/navigation/index';
import {Provider as PaperProvider} from 'react-native-paper';
import VersionCheck from 'react-native-version-check';
import {useEffect} from 'react';

const App = () => {
  const checkUpdateNeeded = async () => {
    try {
      let updateNeeded = await VersionCheck.needUpdate();
      if (updateNeeded && updateNeeded.isNeeded) {
        Alert.alert(
          'Please Update',
          'You will have to update your app to the latest version to continue using',
          [
            {
              text: 'Update',
              onPress: () => {
                BackHandler.exitApp();
                Linking.openURL(updateNeeded.storeUrl);
              },
            },
          ],
          {cancelable: false},
        );
      }
    } catch (err) {}
  };

  useEffect(() => {
    checkUpdateNeeded();
  }, []);

  return (
    <AuthProvider>
      <AxiosProvider>
        <PaperProvider>
          <SafeAreaView style={styles.container}>
            <MainRouter />
          </SafeAreaView>
        </PaperProvider>
      </AxiosProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
