import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Checklist } from '../types';
import { colors, spacing, typography, shadows } from '../utils/theme';

interface ChecklistItemProps {
  checklist: Checklist;
  onPress: (id: string) => void;
  onDelete: (id: string) => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ checklist, onPress, onDelete }) => {
  const completedCount = checklist.tasks.filter(task => task.completed).length;
  const totalCount = checklist.tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(checklist.id)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{checklist.title}</Text>
          <Text style={styles.count}>
            {completedCount} / {totalCount}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(checklist.id)}
          >
            <Feather name="trash-2" size={18} color={colors.danger} />
          </TouchableOpacity>
          <Feather name="chevron-right" size={20} color={colors.textLight} />
        </View>
      </View>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill,
            { width: `${progress}%` }
          ]} 
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.small,
    alignSelf: 'stretch',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: 0,
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
    letterSpacing: -0.3,
  },
  count: {
    fontSize: typography.fontSize.sm,
    color: colors.textLight,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  progressBar: {
    height: 3,
    backgroundColor: colors.backgroundDark,
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
});

export default ChecklistItem;