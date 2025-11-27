import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import type { ChatOption } from '@/app/chat'

interface InteractiveOptionsProps {
  options: ChatOption[]
  onSelectionChange: (optionId: string, value: string | string[]) => void
  onSubmit: () => void
  canSubmit?: boolean
}

export default function InteractiveOptions({
  options,
  onSelectionChange,
  onSubmit,
  canSubmit = true,
}: InteractiveOptionsProps) {
  const handleRadioSelect = (optionId: string, value: string) => {
    onSelectionChange(optionId, value)
  }

  const handleCheckboxToggle = (optionId: string, value: string) => {
    const option = options.find((opt) => opt.id === optionId)
    if (!option) return

    const currentSelected = (option.selected as string[]) || []
    const newSelected = currentSelected.includes(value)
      ? currentSelected.filter((v) => v !== value)
      : [...currentSelected, value]

    onSelectionChange(optionId, newSelected)
  }

  const renderOptionItem = (option: ChatOption, item: { value: string; label: string }) => {
    const isSelected =
      option.type === 'radio'
        ? option.selected === item.value
        : (option.selected as string[])?.includes(item.value)

    if (option.type === 'radio') {
      return (
        <TouchableOpacity
          key={item.value}
          style={[styles.optionItem, isSelected && styles.optionItemSelected]}
          onPress={() => handleRadioSelect(option.id, item.value)}
        >
          <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
            {isSelected && <View style={styles.radioInner} />}
          </View>
          <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      )
    } else {
      // Checkbox
      return (
        <TouchableOpacity
          key={item.value}
          style={[styles.optionItem, isSelected && styles.optionItemSelected]}
          onPress={() => handleCheckboxToggle(option.id, item.value)}
        >
          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            {isSelected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
          </View>
          <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      )
    }
  }

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <View key={option.id} style={styles.optionGroup}>
          <Text style={styles.optionGroupLabel}>{option.label}</Text>
          <View style={styles.optionsRow}>
            {option.options.map((item) => renderOptionItem(option, item))}
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
        onPress={onSubmit}
        disabled={!canSubmit}
      >
        <LinearGradient
          colors={['#FF6B35', '#FF1493']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.submitButtonGradient}
        >
          <Ionicons name="search" size={16} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>Tìm quán</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    gap: 16,
  },
  optionGroup: {
    gap: 8,
  },
  optionGroupLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  optionItemSelected: {
    backgroundColor: '#FEF3F2',
    borderColor: '#FF6B35',
  },
  optionLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  optionLabelSelected: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#FF6B35',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6B35',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxSelected: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  submitButton: {
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
})

