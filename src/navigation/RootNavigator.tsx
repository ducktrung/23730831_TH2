import React from 'react';
import {useAuthStore} from '@stores/authStore';
import {AuthStack} from './AuthStack';
import {MainTabs} from './MainTabs';

export function RootNavigator() {
  const token = useAuthStore(state => state.token);
  return token ? <MainTabs /> : <AuthStack />;
}
