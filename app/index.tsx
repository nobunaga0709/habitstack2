import React, { useEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView, Platform, KeyboardAvoidingView, TouchableOpacity, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from '../components/Header';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { Checklist, TaskFormData } from '../types/index';
import { getChecklists, saveChecklists, addTask, deleteTask, toggleTask, resetChecklist, addChecklist, updateChecklist, deleteChecklist } from '../utils/storage';
import { colors } from '../utils/theme';
import ChecklistForm from '../components/ChecklistForm';
import ChecklistList from '../components/ChecklistList';
import QuoteCard from '../components/QuoteCard';
import { shouldRecommendLogin } from '../utils/firstLaunch';
import { router } from 'expo-router';

export default function Home() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [currentChecklist, setCurrentChecklist] = useState<Checklist | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showChecklistList, setShowChecklistList] = useState(true);
  const [showQuote, setShowQuote] = useState(true);
  const [showLoginBanner, setShowLoginBanner] = useState(false);

  const tasks = currentChecklist?.tasks || [];
  const completedCount = tasks.filter(task => task.completed).length;

  useEffect(() => {
    loadChecklists();
    checkLoginRecommend();
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
    try {
      const updatedChecklists = await toggleTask(checklists, currentChecklist.id, id);
      setChecklists(updatedChecklists);
      const updatedChecklist = updatedChecklists.find(c => c.id === currentChecklist.id);
      if (updatedChecklist) {
        setCurrentChecklist(updatedChecklist);
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
        
        {showQuote && !currentChecklist && (
          <QuoteCard 
            category="motivation" 
            onClose={() => setShowQuote(false)}
          />
        )}
        
        <View style={styles.content}>
          {showChecklistList ? (
            <>
              <ChecklistList
                checklists={checklists}
                onSelect={handleSelectChecklist}
                onEdit={handleEditChecklist}
                onDelete={handleDeleteChecklist}
              />
              
              {isEditing ? (
                <ChecklistForm
                  onSubmit={handleAddChecklist}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setIsEditing(true)}
                >
                  <Text style={styles.addButtonText}>新しいルーティンを作成</Text>
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
                  />
                  <TaskForm onSubmit={handleAddTask} />
                </>
              )}
            </>
          )}
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
});