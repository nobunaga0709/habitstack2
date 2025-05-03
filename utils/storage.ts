import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checklist, Task } from '../types';

const STORAGE_KEY = 'checklists';

// チェックリスト一覧を取得
export async function getChecklists(): Promise<Checklist[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  if (!json) return [];
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}

// チェックリスト一覧を保存
export async function saveChecklists(checklists: Checklist[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(checklists));
}

// チェックリストを追加
export async function addChecklist(checklists: Checklist[], title: string): Promise<Checklist[]> {
  const now = new Date().toISOString();
  const newChecklist: Checklist = {
    id: Math.random().toString(36).slice(2),
    title,
    tasks: [],
    createdAt: now,
    updatedAt: now,
  };
  const updated = [...checklists, newChecklist];
  await saveChecklists(updated);
  return updated;
}

// チェックリストを更新
export async function updateChecklist(checklists: Checklist[], checklistId: string, title: string): Promise<Checklist[]> {
  const now = new Date().toISOString();
  const updated = checklists.map(c =>
    c.id === checklistId ? { ...c, title, updatedAt: now } : c
  );
  await saveChecklists(updated);
  return updated;
}

// チェックリストを削除
export async function deleteChecklist(checklists: Checklist[], checklistId: string): Promise<Checklist[]> {
  const updated = checklists.filter(c => c.id !== checklistId);
  await saveChecklists(updated);
  return updated;
}

// タスクを追加
export async function addTask(checklists: Checklist[], checklistId: string, title: string): Promise<Checklist[]> {
  const now = new Date().toISOString();
  const updated = checklists.map(c => {
    if (c.id !== checklistId) return c;
    const newTask: Task = {
      id: Math.random().toString(36).slice(2),
      title,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    return { ...c, tasks: [...c.tasks, newTask], updatedAt: now };
  });
  await saveChecklists(updated);
  return updated;
}

// タスクを削除
export async function deleteTask(checklists: Checklist[], checklistId: string, taskId: string): Promise<Checklist[]> {
  const now = new Date().toISOString();
  const updated = checklists.map(c => {
    if (c.id !== checklistId) return c;
    return { ...c, tasks: c.tasks.filter(t => t.id !== taskId), updatedAt: now };
  });
  await saveChecklists(updated);
  return updated;
}

// タスクの完了状態をトグル
export async function toggleTask(checklists: Checklist[], checklistId: string, taskId: string): Promise<Checklist[]> {
  const now = new Date().toISOString();
  const updated = checklists.map(c => {
    if (c.id !== checklistId) return c;
    return {
      ...c,
      tasks: c.tasks.map(t =>
        t.id === taskId ? { ...t, completed: !t.completed, updatedAt: now } : t
      ),
      updatedAt: now,
    };
  });
  await saveChecklists(updated);
  return updated;
}

// チェックリスト内の全タスクを未完了にリセット
export async function resetChecklist(checklists: Checklist[], checklistId: string): Promise<Checklist[]> {
  const now = new Date().toISOString();
  const updated = checklists.map(c => {
    if (c.id !== checklistId) return c;
    return {
      ...c,
      tasks: c.tasks.map(t => ({ ...t, completed: false, updatedAt: now })),
      updatedAt: now,
    };
  });
  await saveChecklists(updated);
  return updated;
} 