import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface Props {
   selectedFilter: string
   onFilterChange: (filter: string) => void
}

const filters = [
  { key: 'all', label: 'Tất cả', icon: 'restaurant' },
  { key: 'vietnamese', label: 'Việt Nam', icon: 'fast-food' },
  { key: 'vegetarian', label: 'Chay', icon: 'leaf' },
  { key: 'pizza', label: 'Pizza', icon: 'pizza' },
  { key: 'chinese', label: 'Trung Hoa', icon: 'restaurant-outline' },
  { key: 'coffee', label: 'Cà phê', icon: 'cafe' },
]

export default function FilterButtons({ selectedFilter, onFilterChange }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        decelerationRate="fast"
        snapToInterval={80}
      >
        {filters.map((filter) => {
          const selected = selectedFilter === filter.key
          return (
            <TouchableOpacity
              key={filter.key}
              onPress={() => onFilterChange(filter.key)}
              style={[
                styles.filterButton,
                selected ? styles.selectedButton : styles.unselectedButton,
              ]}
            >
              <Ionicons
                name={filter.icon as any}
                size={16}
                color={selected ? '#ffffff' : '#3b82f6'}
                style={styles.filterIcon}
              />
              <Text
                style={[
                  styles.filterText,
                  selected ? styles.selectedText : styles.unselectedText,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 130, // Tăng từ 118 lên 130 để cách xa hơn
    left: 0,
    right: 0,
    zIndex: 10,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedButton: {
    backgroundColor: '#3b82f6',
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  unselectedButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  selectedText: {
    color: '#ffffff',
  },
  unselectedText: {
    color: '#374151',
  },
})
