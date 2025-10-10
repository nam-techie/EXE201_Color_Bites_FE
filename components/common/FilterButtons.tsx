import { Ionicons } from '@expo/vector-icons'
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
                size={18}
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
    top: 112,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  scrollView: {
    flexDirection: 'row',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  filterButton: {
    marginRight: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#3b82f6',
  },
  unselectedButton: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontWeight: '500',
  },
  selectedText: {
    color: '#ffffff',
  },
  unselectedText: {
    color: '#374151',
  },
})
