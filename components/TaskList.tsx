import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Task } from '../types';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { colors } from '../utils/theme';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  onToggleTask,
  onDeleteTask,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={[
        styles.item,
        item.completed && styles.itemCompleted
      ]}
      onPress={() => onToggleTask(item.id)}
    >
      <View style={styles.checkbox}>
        {item.completed ? (
          <FontAwesome name="check-circle" size={24} color={colors.success} />
        ) : (
          <FontAwesome name="circle-o" size={24} color={colors.textLight} />
        )}
      </View>
      <View style={styles.content}>
        <Text style={[
          styles.title,
          item.completed && styles.titleCompleted
        ]}>
          {item.title}
        </Text>
        <View style={styles.footer}>
          <View style={styles.date}>
            <Feather name="clock" size={14} color={colors.textLight} />
            <Text style={styles.dateText}>
              {formatDate(item.createdAt)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDeleteTask(item.id)}
          >
            <Feather name="trash-2" size={18} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  if (tasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>タスクがありません</Text>
        <Text style={styles.emptySubText}>新しいタスクを追加してください</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tasks}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemCompleted: {
    opacity: 0.7,
  },
  checkbox: {
    marginRight: 12,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textLight,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: colors.textLight,
  },
  deleteButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
});

export default TaskList;