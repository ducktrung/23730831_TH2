// TH2 | 23730831 | NGUYEN DUC TRUNG | #700094
import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {RootNavigator} from '@navigation/RootNavigator';

const queryClient = new QueryClient({
  defaultOptions: {queries: {retry: 1}},
});
export default function App() {
  return <SafeAreaProvider>
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <RootNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  </SafeAreaProvider>;
}
