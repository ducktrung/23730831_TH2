import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {VARIANT} from '@constants/student';
import {COLORS} from '@constants/theme';
import HomeScreen from '@screens/HomeScreen';
import DetailScreen from '@screens/DetailScreen';
import type {ShopStackParamList} from './types';
const Stack = createNativeStackNavigator<ShopStackParamList>();
export function ShopStack() {
  return <Stack.Navigator screenOptions={{headerShown: false, contentStyle: {backgroundColor: COLORS.background}}}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Detail" component={DetailScreen}
      options={{presentation: VARIANT.detailPresentation}} />
  </Stack.Navigator>;
}
