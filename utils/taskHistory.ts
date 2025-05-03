import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'task_history';

// 履歴データ型: { [date: string]: string[] } 例: { '2024-05-03': ['taskId1', 'taskId2'] }
export type TaskHistory = Record<string, string[]>;

// 履歴を取得
export async function getTaskHistory(): Promise<TaskHistory> {
  const json = await AsyncStorage.getItem(HISTORY_KEY);
  if (!json) return {};
  try {
    return JSON.parse(json);
  } catch {
    return {};
  }
}

// 履歴に追加
export async function addTaskHistory(taskId: string, date: string = new Date().toISOString().slice(0, 10)) {
  const history = await getTaskHistory();
  if (!history[date]) history[date] = [];
  if (!history[date].includes(taskId)) {
    history[date].push(taskId);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }
} 