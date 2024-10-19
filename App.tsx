import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import HealthKit from './src/components/healthkit/HealthKit';
import colours from './src/styles/colours';

const App: React.FC = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={styles.container}>
        <HealthKit />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
  },
});

export default App;