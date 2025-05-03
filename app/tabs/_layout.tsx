import { Tabs } from 'expo-router';
import { Feather, FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#ff7043',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0, height: 60 },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'home') {
            return <Feather name="list" size={size} color={color} />;
          } else if (route.name === 'heatmap') {
            return <FontAwesome name="fire" size={size} color={color} />;
          } else if (route.name === 'settings') {
            return <Feather name="settings" size={size} color={color} />;
          }
          return null;
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'ホーム' }} />
      <Tabs.Screen name="heatmap" options={{ title: 'ヒートマップ' }} />
      <Tabs.Screen name="settings" options={{ title: '設定' }} />
    </Tabs>
  );
} 