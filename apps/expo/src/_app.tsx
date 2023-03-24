import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';

import { HomeScreen } from './screens/home';
import { SignInSignUpScreen } from './screens/signin';
import { TRPCProvider } from './utils/api';
import { tokenCache } from './utils/cache';

export const App = () => {
  return (
    <ClerkProvider
      publishableKey={Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY as string}
      tokenCache={tokenCache}
    >
      <StatusBar />
      <SignedIn>
        <TRPCProvider>
          <SafeAreaProvider>
            <HomeScreen />
          </SafeAreaProvider>
        </TRPCProvider>
      </SignedIn>
      <SignedOut>
        <SignInSignUpScreen />
      </SignedOut>
    </ClerkProvider>
  );
};
