import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
// Reanimatedを事前にインポート
import 'react-native-reanimated';
import { useEffect } from 'react';
import { LogBox } from 'react-native';

// Firebase関連の警告を非表示にする
LogBox.ignoreLogs([
  'AsyncStorage has been extracted from react-native core',
  'Setting a timer for a long period of time',
]);

// Layoutコンポーネント - アプリケーションのレイアウト構造を定義
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="tabs" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="index" />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});