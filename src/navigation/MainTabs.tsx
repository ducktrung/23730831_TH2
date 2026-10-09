import React from 'react';
import {Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS} from '@constants/theme';
import {VARIANT} from '@constants/student';
import {useCartStore} from '@stores/cartStore';
import CartScreen from '@screens/CartScreen';
import MeScreen from '@screens/MeScreen';
import {ShopStack} from './ShopStack';
import type {MainTabParamList} from './types';
const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  const total = useCartStore(state => state.items.reduce((sum, row) => sum + row.qty, 0));
  const shopTab = <Tab.Screen key="Shop" name="Shop" component={ShopStack}
    options={{title: 'Cửa hàng', tabBarIcon: ({color}) => <Text style={{color, fontSize: 19}}>⌂</Text>}} />;
  const cartTab = <Tab.Screen key="Cart" name="Cart" component={CartScreen}
    options={{title: 'Giỏ', tabBarBadge: total > 0 ? total : undefined,
      tabBarBadgeStyle: {backgroundColor: COLORS.secondary, color: '#FFFFFF'},
      tabBarIcon: ({color}) => <Text style={{color, fontSize: 18}}>▣</Text>}} />;
  return <Tab.Navigator screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: COLORS.primary,
    tabBarInactiveTintColor: COLORS.textLight,
    tabBarStyle: {backgroundColor: COLORS.surface, borderTopColor: COLORS.border, height: 62},
    tabBarLabelStyle: {fontSize: 11, fontWeight: '700', marginBottom: 4},
  }}>
    {VARIANT.tabOrder === 'shopFirst' ? <>{shopTab}{cartTab}</> : <>{cartTab}{shopTab}</>}
    <Tab.Screen name="Me" component={MeScreen}
      options={{title: 'Tôi', tabBarIcon: ({color}) => <Text style={{color, fontSize: 18}}>◉</Text>}} />
  </Tab.Navigator>;
}
