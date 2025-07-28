import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

interface RestaurantSearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onClearSearch: () => void
}

export default function RestaurantSearchBar({ searchQuery, onSearchChange, onClearSearch }: RestaurantSearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Tìm kiếm nhà hàng..."
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholderTextColor="#9CA3AF"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={onClearSearch} style={styles.clearButton}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 48,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  searchContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    color: "#9CA3AF",
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
  },
  clearButton: {
    marginLeft: 8,
  },
  clearText: {
    color: "#9CA3AF",
    fontSize: 18,
  },
})
