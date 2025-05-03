import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ChecklistFormData } from '../types';
import { colors } from '../utils/theme';
import { Feather } from '@expo/vector-icons';

interface ChecklistFormProps {
  onSubmit: (data: ChecklistFormData) => void;
  initialData?: ChecklistFormData;
  onCancel?: () => void;
}

const ChecklistForm: React.FC<ChecklistFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');

  const handleSubmit = () => {
    if (title.trim()) {
      onSubmit({ title: title.trim() });
      setTitle('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="ルーティンのタイトル"
          placeholderTextColor="#666"
        />
        {onCancel && (
          <TouchableOpacity style={[styles.iconButton, styles.cancelButton]} onPress={onCancel}>
            <Feather name="x" size={20} color={colors.white} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.iconButton, styles.submitButton]} onPress={handleSubmit}>
          <Feather name="check" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
    marginBottom: 0,
    width: '100%',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 0,
    fontSize: 16,
    flex: 1,
    backgroundColor: colors.white,
  },
  iconButton: {
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    backgroundColor: colors.danger,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChecklistForm;