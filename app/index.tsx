import React, { useEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView, Platform, KeyboardAvoidingView, TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from '../components/Header';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { Checklist, Task, TaskFormData } from '../types/index';
import { getChecklists, saveChecklists, addTask, deleteTask, toggleTask, resetChecklist, addChecklist, updateChecklist, deleteChecklist } from '../utils/storage';
import { colors } from '../utils/theme';
import ChecklistForm from '../components/ChecklistForm';
import ChecklistList from '../components/ChecklistList';
import QuoteCard from '../components/QuoteCard';
import { shouldRecommendLogin } from '../utils/firstLaunch';
import { router } from 'expo-router';
import { addTaskHistory, getTaskHistory } from '../utils/taskHistory';
import TaskHeatmap from '../components/TaskHeatmap';

export default function Home() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [currentChecklist, setCurrentChecklist] = useState<Checklist | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showChecklistList, setShowChecklistList] = useState(true);
  const [showQuote, setShowQuote] = useState(true);
  const [showLoginBanner, setShowLoginBanner] = useState(false);
  const [taskHistory, setTaskHistory] = useState({});

  const tasks = currentChecklist?.tasks || [];
  const completedCount = tasks.filter(task => task.completed).length;

  useEffect(() => {
    loadChecklists();
    checkLoginRecommend();
    getTaskHistory().then(setTaskHistory);
  }, []);

  const loadChecklists = async () => {
    setIsLoading(true);
    try {
      console.log('ルーティン読み込み開始');
      const savedChecklists = await getChecklists();
      console.log('ルーティン読み込み成功:', savedChecklists);
      setChecklists(savedChecklists);
    } catch (error) {
      console.error('ルーティンの読み込みに失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkLoginRecommend = async () => {
    const recommend = await shouldRecommendLogin();
    setShowLoginBanner(recommend);
  };

  const handleToggleTask = async (id: string) => {
    if (!currentChecklist) return;
    // トグル前のタスク状態を取得
    const prevTask = currentChecklist.tasks.find(t => t.id === id);
    const wasCompleted = prevTask?.completed;
    try {
      const updatedChecklists = await toggleTask(checklists, currentChecklist.id, id);
      setChecklists(updatedChecklists);
      const updatedChecklist = updatedChecklists.find(c => c.id === currentChecklist.id);
      if (updatedChecklist) {
        setCurrentChecklist(updatedChecklist);
        // 「未完了→完了」の場合のみ履歴登録
        const toggledTask = updatedChecklist.tasks.find(t => t.id === id);
        if (toggledTask && toggledTask.completed && !wasCompleted) {
          await addTaskHistory(id);
        }
      }
    } catch (error) {
      console.error('タスクの更新に失敗しました:', error);
    }
  };

  const handleAddTask = async (data: TaskFormData) => {
    if (!currentChecklist) {
      console.log('現在のルーティンが存在しません');
      return;
    }
    console.log('タスク追加開始:', {
      checklistId: currentChecklist.id,
      title: data.title,
      currentChecklists: checklists
    });
    try {
      const updatedChecklists = await addTask(checklists, currentChecklist.id, data.title);
      console.log('タスク追加成功:', updatedChecklists);
      setChecklists(updatedChecklists);
      const updatedChecklist = updatedChecklists.find(c => c.id === currentChecklist.id);
      if (updatedChecklist) {
        setCurrentChecklist(updatedChecklist);
      }
    } catch (error) {
      console.error('タスクの追加に失敗しました:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!currentChecklist) return;
    try {
      const updatedChecklists = await deleteTask(checklists, currentChecklist.id, id);
      setChecklists(updatedChecklists);
      const updatedChecklist = updatedChecklists.find(c => c.id === currentChecklist.id);
      if (updatedChecklist) {
        setCurrentChecklist(updatedChecklist);
      }
    } catch (error) {
      console.error('タスクの削除に失敗しました:', error);
    }
  };

  const handleResetTasks = async () => {
    if (!currentChecklist) return;
    Alert.alert(
      '確認',
      '本当にすべてのタスクをリセットしますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        { text: 'OK', style: 'destructive', onPress: async () => {
            try {
              const updatedChecklists = await resetChecklist(checklists, currentChecklist.id);
              setChecklists(updatedChecklists);
              const updatedChecklist = updatedChecklists.find(c => c.id === currentChecklist.id);
              if (updatedChecklist) {
                setCurrentChecklist(updatedChecklist);
              }
            } catch (error) {
              console.error('タスクのリセットに失敗しました:', error);
            }
          }
        },
      ]
    );
  };

  const handleUpdateChecklist = async (data: { title: string }) => {
    if (!currentChecklist) return;
    
    try {
      const updatedChecklists = await updateChecklist(checklists, currentChecklist.id, data.title);
      setChecklists(updatedChecklists);
      const updatedChecklist = updatedChecklists.find(c => c.id === currentChecklist.id);
      if (updatedChecklist) {
        setCurrentChecklist(updatedChecklist);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('ルーティンの更新に失敗しました:', error);
    }
  };

  const handleAddChecklist = async (data: { title: string }) => {
    try {
      const updatedChecklists = await addChecklist(checklists, data.title);
      setChecklists(updatedChecklists);
      setIsEditing(false);
    } catch (error) {
      console.error('ルーティンの追加に失敗しました:', error);
    }
  };

  const handleDeleteChecklist = async (checklist: Checklist) => {
    try {
      const updatedChecklists = await deleteChecklist(checklists, checklist.id);
      setChecklists(updatedChecklists);
      if (currentChecklist?.id === checklist.id) {
        setCurrentChecklist(null);
        setShowChecklistList(true);
      }
    } catch (error) {
      console.error('ルーティンの削除に失敗しました:', error);
    }
  };

  const handleSelectChecklist = (checklist: Checklist) => {
    setCurrentChecklist(checklist);
    setShowChecklistList(false);
    setIsEditing(false);
  };

  const handleBack = () => {
    setCurrentChecklist(null);
    setShowChecklistList(true);
  };

  const handleEditChecklist = async (checklist: Checklist, newTitle: string) => {
    try {
      const updatedChecklists = await updateChecklist(checklists, checklist.id, newTitle);
      setChecklists(updatedChecklists);
      if (currentChecklist?.id === checklist.id) {
        const updatedChecklist = updatedChecklists.find(c => c.id === checklist.id);
        if (updatedChecklist) {
          setCurrentChecklist(updatedChecklist);
        }
      }
    } catch (error) {
      console.error('ルーティンの更新に失敗しました:', error);
    }
  };

  // タスク並び替え
  const handleReorderTasks = async (newTasks: Task[]) => {
    if (!currentChecklist) return;
    // 現在のchecklists配列のcurrentChecklistだけtasksを新順序で差し替え
    const updatedChecklists = checklists.map(c =>
      c.id === currentChecklist.id ? { ...c, tasks: newTasks } : c
    );
    setChecklists(updatedChecklists);
    // currentChecklistも更新
    setCurrentChecklist({ ...currentChecklist, tasks: newTasks });
    // ストレージにも保存
    await saveChecklists(updatedChecklists);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar style="dark" />
      <View style={styles.topSpacer} />
      {showLoginBanner && (
        <TouchableOpacity style={styles.loginBanner} onPress={() => router.push('/auth')}>
          <Text style={styles.loginBannerText}>データのバックアップ・引き継ぎのためにログインをおすすめします</Text>
        </TouchableOpacity>
      )}
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        
          <View style={styles.headerContainer}>
            {currentChecklist && (
              <Header 
                title={currentChecklist.title}
                onBack={handleBack}
                onReset={handleResetTasks} 
                completedCount={completedCount} 
                totalCount={tasks.length} 
              />
            )}
          </View>
          <View style={styles.content}>
          
          {showQuote && !currentChecklist && (
            <QuoteCard 
              category="motivation" 
              onClose={() => setShowQuote(false)}
            />
          )}
          
          <View style={{ flex: 1 }}>
            {showChecklistList ? (
              <>
                <ScrollView 
                  style={{ flex: 1 }} 
                  contentContainerStyle={{ 
                    paddingBottom: 32
                  }} 
                  showsVerticalScrollIndicator={false}
                >
                  <ChecklistList
                    checklists={checklists}
                    onSelect={handleSelectChecklist}
                    onEdit={handleEditChecklist}
                    onDelete={handleDeleteChecklist}
                  />
                </ScrollView>
                {isEditing && (
                  <View style={styles.formFixed}>
                    <ChecklistForm
                      onSubmit={handleAddChecklist}
                      onCancel={() => setIsEditing(false)}
                    />
                  </View>
                )}
                {!isEditing && (
                  <TouchableOpacity
                    style={styles.fab}
                    onPress={() => setIsEditing(true)}
                  >
                    <Text style={styles.fabText}>＋</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <>
                {isEditing && currentChecklist ? (
                  <ChecklistForm
                    initialData={{ title: currentChecklist.title }}
                    onSubmit={handleUpdateChecklist}
                    onCancel={() => setIsEditing(false)}
                  />
                ) : (
                  <>
                    <TaskList 
                      tasks={tasks} 
                      isLoading={isLoading} 
                      onToggleTask={handleToggleTask}
                      onDeleteTask={handleDeleteTask}
                      onReorderTasks={handleReorderTasks}
                    />
                    <TaskForm onSubmit={handleAddTask} />
                  </>
                )}
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 12 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topSpacer: {
    height: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: colors.background,
  },
  headerContainer: {
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  loginBanner: {
    backgroundColor: '#4285F4',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBannerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bottomFixed: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingBottom: 8,
    paddingTop: 8,
    zIndex: 10,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 20,
  },
  fabText: {
    color: colors.white,
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: -2,
  },
  formFixed: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 30,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
});

