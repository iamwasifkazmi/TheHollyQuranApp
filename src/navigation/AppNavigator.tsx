import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen } from '../screens/HomeScreen';
import { SurahsScreen } from '../screens/SurahsScreen';
import { SurahDetailScreen } from '../screens/SurahDetailScreen';
import { JuzScreen } from '../screens/JuzScreen';
import { JuzDetailScreen } from '../screens/JuzDetailScreen';
import { BookmarksScreen } from '../screens/BookmarksScreen';
import { ReaderScreen } from '../screens/ReaderScreen';
import { PageJumpScreen } from '../screens/PageJumpScreen';
import { colors } from '../theme/colors';
import type { MainTabParamList, RootStackParamList } from '../types/quran';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '🏠',
    Surahs: '📋',
    Juz: '📑',
    Bookmarks: '🔖',
  };
  return (
    <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      {icons[label] ?? '•'}
    </Text>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon label={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Surahs" component={SurahsScreen} />
      <Tab.Screen name="Juz" component={JuzScreen} />
      <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="SurahDetail"
          component={SurahDetailScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="JuzDetail"
          component={JuzDetailScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Reader"
          component={ReaderScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="PageJump"
          component={PageJumpScreen}
          options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.borderLight,
    borderTopWidth: 1,
    paddingTop: 4,
    height: 60,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.6,
  },
  tabIconFocused: {
    opacity: 1,
  },
});
