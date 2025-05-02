import AsyncStorage from '@react-native-async-storage/async-storage';

const FIRST_LAUNCH_KEY = 'first_launch_date';

export async function getOrSetFirstLaunchDate(): Promise<Date> {
  const stored = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
  if (stored) {
    return new Date(stored);
  } else {
    const now = new Date();
    await AsyncStorage.setItem(FIRST_LAUNCH_KEY, now.toISOString());
    return now;
  }
}

export async function shouldRecommendLogin(): Promise<boolean> {
  const first = await getOrSetFirstLaunchDate();
  const now = new Date();
  const diff = now.getTime() - first.getTime();
  // 3日（本番用）
  return diff >= 3 * 24 * 60 * 60 * 1000;
} 