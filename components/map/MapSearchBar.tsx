import type { GoongPlaceSuggestion } from '@/services/GoongService'
import { GoongService } from '@/services/GoongService'
import { Ionicons } from '@expo/vector-icons'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
    ActivityIndicator,
    Animated,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'

interface MapSearchBarProps {
  onPlaceSelected: (place: GoongPlaceSuggestion) => void
  onMenuPress: () => void
  onAvatarPress: () => void
  avatarUrl?: string | null
  placeholder?: string
}

interface SearchSuggestion extends GoongPlaceSuggestion {
  isRecent?: boolean
}

export default function MapSearchBar({
  onPlaceSelected,
  onMenuPress,
  onAvatarPress,
  avatarUrl,
  placeholder = 'Tìm kiếm địa điểm...'
}: MapSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [recentSearches, setRecentSearches] = useState<SearchSuggestion[]>([])
  
  const searchTimeoutRef = useRef<NodeJS.Timeout>()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current

  // Load recent searches from storage
  useEffect(() => {
    loadRecentSearches()
  }, [])

  // Animate suggestions panel
  useEffect(() => {
    if (suggestions.length > 0 || recentSearches.length > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        })
      ]).start()
    }
  }, [suggestions, recentSearches])

  const loadRecentSearches = async () => {
    // TODO: Load from AsyncStorage
    // For now, use empty array
    setRecentSearches([])
  }

  const saveRecentSearch = async (place: SearchSuggestion) => {
    // TODO: Save to AsyncStorage
    // For now, just update state
    const newRecent = [place, ...recentSearches.slice(0, 4)] // Keep only 5 recent
    setRecentSearches(newRecent)
  }

  const searchPlaces = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      const results = await GoongService.autocompleteV2(query)
      const searchResults: SearchSuggestion[] = results.map(place => ({
        ...place,
        isRecent: false
      }))
      setSuggestions(searchResults)
    } catch (error) {
      console.error('Error searching places:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSearchChange = (text: string) => {
    setSearchQuery(text)
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      searchPlaces(text)
    }, 300)
  }

  const handlePlaceSelect = (place: SearchSuggestion) => {
    setSearchQuery(place.description)
    setSuggestions([])
    setIsFocused(false)
    
    // Save to recent searches
    saveRecentSearch(place)
    
    // Notify parent
    onPlaceSelected(place)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setSuggestions([])
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    // Delay blur to allow selection
    setTimeout(() => {
      setIsFocused(false)
    }, 150)
  }

  const renderSuggestion = ({ item }: { item: SearchSuggestion }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handlePlaceSelect(item)}
    >
      <Ionicons
        name={item.isRecent ? 'time-outline' : 'location-outline'}
        size={20}
        color={item.isRecent ? '#6B7280' : '#3B82F6'}
        style={styles.suggestionIcon}
      />
      <View style={styles.suggestionContent}>
        <Text style={styles.suggestionText} numberOfLines={1}>
          {item.description}
        </Text>
        {item.isRecent && (
          <Text style={styles.recentLabel}>Tìm kiếm gần đây</Text>
        )}
      </View>
      {item.isRecent && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => {
            // TODO: Remove from recent searches
          }}
        >
          <Ionicons name="close" size={16} color="#6B7280" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  )

  const showSuggestions = isFocused && (suggestions.length > 0 || recentSearches.length > 0)

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={handleSearchChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {isLoading && (
            <ActivityIndicator size="small" color="#3B82F6" style={styles.loadingIcon} />
          )}
          {searchQuery.length > 0 && !isLoading && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Menu Button */}
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <Ionicons name="menu" size={24} color="#374151" />
        </TouchableOpacity>

        {/* Avatar Button */}
        <TouchableOpacity style={styles.avatarButton} onPress={onAvatarPress}>
          {avatarUrl ? (
            <View style={styles.avatarImageContainer}>
              {/* TODO: Add Image component for avatar */}
              <Text style={styles.avatarText}>👤</Text>
            </View>
          ) : (
            <Ionicons name="person-circle" size={32} color="#6B7280" />
          )}
        </TouchableOpacity>
      </View>

      {/* Suggestions Panel */}
      {showSuggestions && (
        <Animated.View
          style={[
            styles.suggestionsContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <FlatList
            data={suggestions.length > 0 ? suggestions : recentSearches}
            renderItem={renderSuggestion}
            keyExtractor={(item) => item.id}
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'transparent',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50, // Safe area
    paddingBottom: 12,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    paddingVertical: 4,
  },
  loadingIcon: {
    marginLeft: 8,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  menuButton: {
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarButton: {
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarImageContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 110, // Below search bar
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: 300,
  },
  suggestionsList: {
    maxHeight: 300,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  recentLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  removeButton: {
    padding: 4,
  },
})
