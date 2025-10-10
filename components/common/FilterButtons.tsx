import { Ionicons } from '@expo/vector-icons'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface Props {
  selectedFilter: string
  onFilterChange: (filter: string) => void
}

const filters = [
  { key: 'all', label: 'Nhà riêng', icon: 'home' },
  { key: 'restaurant', label: 'Nhà hàng', icon: 'restaurant' },
  { key: 'hotel', label: 'Khách sạn', icon: 'bed' },
  { key: 'coffee', label: 'Cà phê', icon: 'cafe' },
  { key: 'shopping', label: 'Mua sắm', icon: 'cart' },
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
                size={16}
                color={selected ? '#185ABC' : '#5F6368'}
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
    top: 116,
    left: 0,
    right: 0,
    zIndex: 9,
  },
  scrollView: {
    flexDirection: 'row',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  filterButton: {
    marginRight: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  selectedButton: {
    backgroundColor: '#D2E3FC',
    borderColor: '#D2E3FC',
  },
  unselectedButton: {
    backgroundColor: '#ffffff',
    borderColor: '#DADCE0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontWeight: '500',
    fontSize: 14,
  },
  selectedText: {
    color: '#185ABC',
  },
  unselectedText: {
    color: '#3C4043',
  },
})
