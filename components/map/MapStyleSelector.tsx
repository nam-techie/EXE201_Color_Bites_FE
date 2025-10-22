import { getAllMapStyles, type MapStyle, type MapStyleConfig } from '@/services/GoongMapStyles'
import { Ionicons } from '@expo/vector-icons'
import { useEffect, useRef, useState } from 'react'
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'

interface MapStyleSelectorProps {
  selectedStyle: MapStyle
  onStyleChange: (style: MapStyle) => void
  visible?: boolean
}

export default function MapStyleSelector({
  selectedStyle,
  onStyleChange,
  visible = true
}: MapStyleSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [styles] = useState<MapStyleConfig[]>(getAllMapStyles())
  
  const slideAnim = useRef(new Animated.Value(0)).current
  const rotateAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (isExpanded) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start()
    }
  }, [isExpanded])

  const handleStyleSelect = (style: MapStyle) => {
    onStyleChange(style)
    setIsExpanded(false)
    
    // Animate selection
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start()
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const selectedStyleConfig = styles.find(style => style.id === selectedStyle) || styles[0]

  if (!visible) return null

  return (
    <View style={styles.container}>
      {/* Expanded Options */}
      {isExpanded && (
        <Animated.View
          style={[
            styles.expandedContainer,
            {
              opacity: slideAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {styles.map((style) => (
            <TouchableOpacity
              key={style.id}
              style={[
                styles.styleOption,
                selectedStyle === style.id && styles.selectedOption,
              ]}
              onPress={() => handleStyleSelect(style.id)}
            >
              <Text style={styles.styleIcon}>{style.icon}</Text>
              <View style={styles.styleInfo}>
                <Text
                  style={[
                    styles.styleName,
                    selectedStyle === style.id && styles.selectedStyleName,
                  ]}
                >
                  {style.name}
                </Text>
                <Text style={styles.styleDescription}>{style.description}</Text>
              </View>
              {selectedStyle === style.id && (
                <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
              )}
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}

      {/* Main Button */}
      <Animated.View
        style={[
          styles.mainButton,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.button,
            isExpanded && styles.expandedButton,
          ]}
          onPress={toggleExpanded}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonIcon}>{selectedStyleConfig.icon}</Text>
          <Text style={styles.buttonText}>{selectedStyleConfig.name}</Text>
          <Animated.View
            style={{
              transform: [
                {
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                  }),
                },
              ],
            }}
          >
            <Ionicons
              name="chevron-down"
              size={16}
              color="#6B7280"
            />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 120, // Below search bar
    right: 16,
    zIndex: 999,
  },
  mainButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 120,
  },
  expandedButton: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  buttonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  expandedContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderTopRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 200,
  },
  styleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedOption: {
    backgroundColor: '#EBF4FF',
  },
  styleIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  styleInfo: {
    flex: 1,
  },
  styleName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  selectedStyleName: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  styleDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
})
