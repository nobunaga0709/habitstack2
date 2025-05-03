import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Platform,
  Switch,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  interpolateColor,
  Easing
} from 'react-native-reanimated';
import { Task } from '../types';
import { colors, spacing, typography, shadows } from '../utils/theme';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const completion = useSharedValue(task.completed ? 1 : 0);
  
  useEffect(() => {
    completion.value = withTiming(task.completed ? 1 : 0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [task.completed]);

  const containerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      completion.value,
      [0, 1],
      [colors.white, colors.backgroundDark]
    );
    
    return {
      backgroundColor,
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const textColor = interpolateColor(
      completion.value,
      [0, 1],
      [colors.text, colors.textLight]
    );
    
    return {
      color: textColor,
    };
  });

  return (
    <AnimatedPressable 
      style={[styles.container, containerStyle]}
      onPress={() => onToggle(task.id)}
    >
      <View style={styles.content}>
        <Animated.Text style={[styles.title, textStyle]}>
          {task.title}
        </Animated.Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(task.id)}
          >
            <Feather name="trash-2" size={18} color={colors.danger} />
          </TouchableOpacity>
          <Switch
            value={task.completed}
            onValueChange={() => onToggle(task.id)}
            trackColor={{ 
              false: colors.borderDark, 
              true: colors.primaryLight 
            }}
            thumbColor={task.completed ? colors.primary : colors.white}
            ios_backgroundColor={colors.borderDark}
            style={styles.switch}
          />
        </View>
      </View>
      <Animated.View 
        style={[
          styles.progressBar,
          { width: task.completed ? '100%' : '0%' }
        ]} 
      />
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.small,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    flexShrink: 1,
    marginRight: spacing.md,
    letterSpacing: -0.3,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  switch: {
    transform: [{ scale: 0.8 }],
  },
  progressBar: {
    height: 3,
    backgroundColor: colors.primary,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});

export default TaskItem;