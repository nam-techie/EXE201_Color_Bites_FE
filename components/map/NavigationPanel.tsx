import type { DirectionResult } from '@/services/GoongDirectionService'
import { formatDistance, formatDuration, getInstructionIcon } from '@/services/GoongDirectionService'
import { Ionicons } from '@expo/vector-icons'
import { useEffect, useRef, useState } from 'react'
import {
    Animated,
    Dimensions,
    FlatList,
    PanResponder,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'

interface NavigationPanelProps {
  routeData: DirectionResult | null
  visible: boolean
  onClose: () => void
  onStartNavigation: () => void
  onClearRoute: () => void
}

const { height: screenHeight } = Dimensions.get('window')
const PANEL_HEIGHT = screenHeight * 0.4 // 40% of screen height
const MIN_PANEL_HEIGHT = 120
const MAX_PANEL_HEIGHT = screenHeight * 0.6

export default function NavigationPanel({
  routeData,
  visible,
  onClose,
  onStartNavigation,
  onClearRoute
}: NavigationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  
  const translateY = useRef(new Animated.Value(PANEL_HEIGHT)).current
  const opacity = useRef(new Animated.Value(0)).current

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 10
      },
      onPanResponderMove: (_, gestureState) => {
        const newY = Math.max(0, Math.min(PANEL_HEIGHT, gestureState.dy))
        translateY.setValue(newY)
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          // Swipe down - collapse
          Animated.timing(translateY, {
            toValue: PANEL_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }).start()
          setIsExpanded(false)
        } else if (gestureState.dy < -50) {
          // Swipe up - expand
          Animated.timing(translateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start()
          setIsExpanded(true)
        } else {
          // Return to original position
          Animated.spring(translateY, {
            toValue: isExpanded ? 0 : PANEL_HEIGHT,
            useNativeDriver: true,
          }).start()
        }
      },
    })
  ).current

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: PANEL_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: screenHeight,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible])

  const toggleExpanded = () => {
    const targetY = isExpanded ? PANEL_HEIGHT : 0
    Animated.timing(translateY, {
      toValue: targetY,
      duration: 250,
      useNativeDriver: true,
    }).start()
    setIsExpanded(!isExpanded)
  }

  const renderRouteSummary = () => {
    if (!routeData) return null

    return (
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Ionicons name="time-outline" size={20} color="#3B82F6" />
            <Text style={styles.summaryLabel}>Thời gian</Text>
            <Text style={styles.summaryValue}>
              {formatDuration(routeData.duration)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="resize-outline" size={20} color="#10B981" />
            <Text style={styles.summaryLabel}>Khoảng cách</Text>
            <Text style={styles.summaryValue}>
              {formatDistance(routeData.distance)}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  const renderStep = ({ item, index }: { item: any; index: number }) => (
    <View style={[
      styles.stepItem,
      index === currentStepIndex && styles.currentStep
    ]}>
      <View style={styles.stepIcon}>
        <Text style={styles.stepIconText}>
          {getInstructionIcon(item.type)}
        </Text>
      </View>
      <View style={styles.stepContent}>
        <Text style={styles.stepInstruction} numberOfLines={2}>
          {item.instruction}
        </Text>
        <Text style={styles.stepDistance}>
          {formatDistance(item.distance)} • {formatDuration(item.duration)}
        </Text>
      </View>
    </View>
  )

  const renderSteps = () => {
    if (!routeData?.steps || routeData.steps.length === 0) return null

    return (
      <View style={styles.stepsContainer}>
        <Text style={styles.stepsTitle}>Hướng dẫn đường đi</Text>
        <FlatList
          data={routeData.steps}
          renderItem={renderStep}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          style={styles.stepsList}
        />
      </View>
    )
  }

  if (!visible) return null

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.panel} {...panResponder.panHandlers}>
        {/* Drag Handle */}
        <View style={styles.dragHandle}>
          <View style={styles.dragIndicator} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="navigate" size={24} color="#3B82F6" />
            <Text style={styles.headerTitle}>Chỉ đường</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={onClearRoute}
            >
              <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Route Summary */}
        {renderRouteSummary()}

        {/* Expandable Content */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            {renderSteps()}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.expandButton}
            onPress={toggleExpanded}
          >
            <Ionicons
              name={isExpanded ? 'chevron-down' : 'chevron-up'}
              size={20}
              color="#6B7280"
            />
            <Text style={styles.expandButtonText}>
              {isExpanded ? 'Thu gọn' : 'Xem chi tiết'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.startButton}
            onPress={onStartNavigation}
          >
            <Ionicons name="play" size={20} color="#FFFFFF" />
            <Text style={styles.startButtonText}>Bắt đầu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    maxHeight: MAX_PANEL_HEIGHT,
  },
  dragHandle: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
  },
  summaryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  expandedContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepsContainer: {
    marginTop: 16,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  stepsList: {
    maxHeight: 200,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  currentStep: {
    backgroundColor: '#EBF4FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginHorizontal: -8,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepIconText: {
    fontSize: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepInstruction: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  stepDistance: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginRight: 12,
  },
  expandButtonText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  startButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
})
