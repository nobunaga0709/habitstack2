import React from 'react';
import { View, Text } from 'react-native';
import TaskHeatmap from '../../components/TaskHeatmap';

// 仮のダミーデータ
const dummyHistory = {
  '2024-05-01': ['a'],
  '2024-05-02': ['a', 'b'],
  '2024-05-03': ['a', 'b', 'c'],
  '2024-05-04': ['a'],
  '2024-05-05': ['a', 'b', 'c', 'd'],
};

export default function HeatmapScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
      <TaskHeatmap history={dummyHistory} />
    </View>
  );
} 