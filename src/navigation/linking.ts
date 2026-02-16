import type { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import type { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/'), 'quitnicotine://'],
  config: {
    screens: {
      Auth: {
        screens: {
          Invite: 'invite/:code',
        },
      },
      App: {
        screens: {
          Tabs: {
            screens: {
              Home: '',
              Progress: 'progress',
              Content: 'content',
              Settings: 'settings',
            },
          },
          Accountability: 'accountability',
          ContentDetail: 'content/:slug',
          Paywall: 'paywall',
        },
      },
    },
  },
};
