import type { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import type { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/'), 'quitnicotine://'],
  config: {
    screens: {
      Onboarding: {
        screens: {
          Welcome: 'welcome',
          AuthCreation: 'signup',
        },
      },
      App: {
        screens: {
          Tabs: {
            screens: {
              Home: '',
              Timeline: 'timeline',
              Journal: 'journal',
              Settings: 'settings',
            },
          },
          Accountability: 'accountability',
          ContentDetail: 'content/:slug',
          Paywall: 'paywall',
          CravingSOS: 'sos',
        },
      },
    },
  },
};
