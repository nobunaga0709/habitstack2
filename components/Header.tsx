import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { RefreshCw, ChevronLeft } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSequence, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { colors, spacing, typography, shadows } from '../utils/theme';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  onReset: () => void;
  completedCount: number;
  totalCount: number;
}

const Header: React.FC<HeaderProps> = ({ title, onBack, onReset, completedCount, totalCount }) => {
  const rotation = useSharedValue(0);
  const progress = (completedCount / totalCount) * 100;
  
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const handleReset = () => {
    rotation.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(360, { 
        duration: 600,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );
    onReset();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <View style={styles.titleContainer}>
          {onBack && (
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={onBack}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          )}
          <View>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.subtitle}>
                完了: {completedCount} / {totalCount}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity 
          style={[
            styles.resetButton,
            completedCount === 0 && styles.resetButtonDisabled
          ]} 
          onPress={handleReset}
          disabled={completedCount === 0}
          activeOpacity={0.7}
        >
          <Animated.View style={animatedStyles}>
            <RefreshCw 
              size={20} 
              color={completedCount > 0 ? colors.white : colors.textLight} 
              strokeWidth={2.5}
            />
          </Animated.View>
          <Text style={[
            styles.resetText,
            completedCount === 0 && styles.resetTextDisabled
          ]}>
            リセット
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? spacing.xxl : spacing.xl,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.white,
    ...shadows.medium,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.backgroundDark,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textLight,
    minWidth: 80,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    ...shadows.small,
  },
  resetButtonDisabled: {
    backgroundColor: colors.backgroundDark,
  },
  resetText: {
    color: colors.white,
    fontWeight: '600',
    marginLeft: spacing.xs,
    fontSize: typography.fontSize.sm,
  },
  resetTextDisabled: {
    color: colors.textLight,
  },
});

export default Header;