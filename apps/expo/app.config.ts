import type { ConfigContext, ExpoConfig } from '@expo/config';

const defineConfig = (_ctx: ConfigContext): ExpoConfig => ({
  name: 'T3 Turbo',
  slug: 'acme',
  scheme: 'acme',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/icon.png',
    resizeMode: 'contain',
    backgroundColor: '#2e026d',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'your.bundle.identifier',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/icon.png',
      backgroundColor: '#2e026d',
    },
    package: 'your.bundle.identifier',
  },
  extra: {
    eas: {
      projectId: process.env.EXPO_PROJECT_ID,
    },
    CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
  plugins: ['./expo-plugins/with-modify-gradle.js'],
});

export default defineConfig;
