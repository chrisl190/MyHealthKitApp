import React from 'react';
import { Authenticator, ThemeProvider } from '@aws-amplify/ui-react-native';
import { Amplify } from 'aws-amplify';
import awsmobile from './src/aws-exports';
import HealthKit from './src/components/healthkit/HealthKit';

Amplify.configure(awsmobile);

function App() {
  return (
    <ThemeProvider>
      <Authenticator.Provider>
        <Authenticator>
          <HealthKit />
        </Authenticator>
      </Authenticator.Provider>
    </ThemeProvider>
  );
}

export default App;
