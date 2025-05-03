import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TaskHistory } from '../utils/taskHistory';
import { colors } from '../utils/theme';

const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

const DATE_LABEL_WIDTH = 32; // 日付ラベルの幅
const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_MARGIN = 16; // 左右の余白
const CELL_COUNT = 7;
const CELL_GAP = 4; // セル間の隙間(px)
const GRID_INNER_WIDTH = SCREEN_WIDTH - GRID_MARGIN * 2 - DATE_LABEL_WIDTH * 2;
const CELL_SIZE = Math.floor((GRID_INNER_WIDTH - CELL_GAP * (CELL_COUNT - 1)) / CELL_COUNT);
const GRID_WIDTH = CELL_SIZE * CELL_COUNT + CELL_GAP * (CELL_COUNT - 1) + DATE_LABEL_WIDTH * 2;

interface TaskHeatmapProps {
  history: TaskHistory;
}

const colorLevels = [
  colors.backgroundLight,
  '#b3e5fc',
  '#4fc3f7',
  '#0288d1',
  colors.primary,
];

function getColor(count: number) {
  if (count === 0) return colorLevels[0];
  if (count === 1) return colorLevels[1];
  if (count === 2) return colorLevels[2];
  if (count >= 3 && count < 5) return colorLevels[3];
  return colorLevels[4];
}

export const TaskHeatmap: React.FC<TaskHeatmapProps> = ({ history }) => {
  // 直近28日分の日付配列を生成
  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    return d;
  });
  const rows = Array.from({ length: 4 }, (_, row) => days.slice(row * 7, row * 7 + 7));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>これまでの積み上げ</Text>
      {/* 曜日ラベル */}
      <View style={styles.weekRow}>
        <View style={{ width: DATE_LABEL_WIDTH }} />
        {weekDays.map((w, i) => (
          <Text key={i} style={styles.weekDay}>{w}</Text>
        ))}
        <View style={{ width: DATE_LABEL_WIDTH }} />
      </View>
      <View style={styles.heatmapGrid}>
        {rows.map((week, rowIdx) => (
          <View key={rowIdx} style={styles.heatmapRow}>
            <Text style={[styles.dateLabelSide, styles.dateLabelLeftSide]}>
              {week[0].getMonth() + 1}/{week[0].getDate()}
            </Text>
            {week.map((date, colIdx) => {
              const dateStr = date.toISOString().slice(0, 10);
              const count = history[dateStr]?.length || 0;
              return (
                <View key={dateStr} style={[styles.cellWrapper, colIdx !== 0 && { marginLeft: CELL_GAP }]}> {/* gapをmarginで再現 */}
                  <View
                    style={[styles.cell, { backgroundColor: getColor(count), width: CELL_SIZE, height: CELL_SIZE }]}
                    accessibilityLabel={`${dateStr}: ${count}件`}
                  />
                </View>
              );
            })}
            <Text style={[styles.dateLabelSide, styles.dateLabelRightSide]}>
              {week[6].getMonth() + 1}/{week[6].getDate()}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.legendRow}>
        <Text style={styles.legendText}>少</Text>
        <View style={styles.legendBoxRow}>
          {colorLevels.map((c, i) => (
            <View key={i} style={[styles.legendBox, { backgroundColor: c }]} />
          ))}
        </View>
        <Text style={styles.legendText}>多</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 2,
    width: GRID_WIDTH,
    justifyContent: 'space-between',
    marginHorizontal: 'auto',
  },
  weekDay: {
    width: CELL_SIZE,
    textAlign: 'center',
    fontSize: 10,
    color: colors.textLight,
  },
  heatmapGrid: {
    flexDirection: 'column',
    marginBottom: 8,
    width: GRID_WIDTH,
    marginHorizontal: 'auto',
  },
  heatmapRow: {
    flexDirection: 'row',
    width: GRID_WIDTH,
    alignItems: 'center',
  },
  cellWrapper: {
    alignItems: 'center',
    width: CELL_SIZE,
    marginBottom: 12,
  },
  cell: {
    borderRadius: 3,
  },
  dateLabelSide: {
    fontSize: 10,
    color: colors.textLight,
    width: DATE_LABEL_WIDTH,
    textAlign: 'center',
    alignSelf: 'center',
  },
  dateLabelLeftSide: {
    marginRight: 4,
  },
  dateLabelRightSide: {
    marginLeft: 4,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  legendText: {
    fontSize: 10,
    color: colors.textLight,
    marginHorizontal: 4,
  },
  legendBoxRow: {
    flexDirection: 'row',
    gap: 2,
  },
  legendBox: {
    width: 14,
    height: 8,
    borderRadius: 2,
    marginHorizontal: 1,
  },
});

export default TaskHeatmap; 