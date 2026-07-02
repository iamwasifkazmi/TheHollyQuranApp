import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '../screens/HomeScreen';
import { SurahsScreen } from '../screens/SurahsScreen';
import { SurahDetailScreen } from '../screens/SurahDetailScreen';
import { JuzScreen } from '../screens/JuzScreen';
import { JuzDetailScreen } from '../screens/JuzDetailScreen';
import { BookmarksScreen } from '../screens/BookmarksScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ReaderScreen } from '../screens/ReaderScreen';
import { PageJumpScreen } from '../screens/PageJumpScreen';
import { TabBarIcon } from '../components/AppIcon';
import { useAppTheme } from '../context/SettingsContext';
import type { MainTabParamList, RootStackParamList } from '../types/quran';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, Platform.OS === 'ios' ? 8 : 10);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => (
          <TabBarIcon
            routeName={route.name}
            focused={focused}
            color={color}
            size={size}
          />
        ),
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.borderLight,
          borderTopWidth: 1,
          paddingTop: 6,
          paddingBottom: bottomPad,
          height: 52 + bottomPad,
        },
        tabBarItemStyle: {
          paddingTop: 2,
        },
        tabBarLabelStyle: styles.tabLabel,
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Surahs" component={SurahsScreen} />
      <Tab.Screen name="Juz" component={JuzScreen} />
      <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { theme, isDark } = useAppTheme();

  const navTheme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: theme.primary,
          background: theme.background,
          card: theme.surface,
          text: theme.text,
          border: theme.border,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: theme.primary,
          background: theme.background,
          card: theme.surface,
          text: theme.text,
          border: theme.border,
        },
      };

  return (
    <NavigationContainer theme={navTheme}>
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
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 0,
    marginBottom: 0,
  },
});
