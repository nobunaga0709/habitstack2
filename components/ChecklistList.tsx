import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Checklist } from '../types';
import { Edit2, Trash2, Check, X, CheckCircle2 } from 'lucide-react-native';
import { colors } from '../utils/theme';

interface ChecklistListProps {
  checklists: Checklist[];
  onSelect: (checklist: Checklist) => void;
  onEdit: (checklist: Checklist, newTitle: string) => void;
  onDelete: (checklist: Checklist) => void;
}

const ChecklistList: React.FC<ChecklistListProps> = ({
  checklists,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleStartEdit = (checklist: Checklist) => {
    setEditingId(checklist.id);
    setEditTitle(checklist.title);
  };

  const handleSaveEdit = (checklist: Checklist) => {
    onEdit(checklist, editTitle);
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const getCompletionRate = (checklist: Checklist) => {
    if (checklist.tasks.length === 0) return 0;
    const completedTasks = checklist.tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / checklist.tasks.length) * 100);
  };

  return (
    <View style={styles.container}>
      {checklists.map(checklist => {
        const completionRate = getCompletionRate(checklist);
        const completedTasks = checklist.tasks.filter(task => task.completed).length;

        return (
          <View key={checklist.id} style={styles.item}>
            {editingId === checklist.id ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.editInput}
                  value={editTitle}
                  onChangeText={setEditTitle}
                  autoFocus
                />
                <View style={styles.editButtons}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleSaveEdit(checklist)}
                  >
                    <Check size={20} color={colors.success} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleCancelEdit}
                  >
                    <X size={20} color={colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.titleContainer}
                  onPress={() => onSelect(checklist)}
                >
                  <Text style={styles.title}>{checklist.title}</Text>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill,
                          { width: `${completionRate}%` }
                        ]} 
                      />
                    </View>
                    <View style={styles.taskCount}>
                      <CheckCircle2 size={14} color={colors.success} />
                      <Text style={styles.taskCountText}>
                        {completedTasks} / {checklist.tasks.length} 習慣
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <View style={styles.buttons}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleStartEdit(checklist)}
                  >
                    <Edit2 size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => onDelete(checklist)}
                  >
                    <Trash2 size={20} color={colors.danger} />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
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
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.backgroundDark,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  taskCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskCountText: {
    fontSize: 12,
    color: colors.textLight,
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    padding: 8,
  },
  editContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    padding: 8,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
});

export default ChecklistList; 