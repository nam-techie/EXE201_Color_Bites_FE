import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { usePathname, useRouter } from 'expo-router'
import React, { useMemo, useRef } from 'react'
import { Animated, Dimensions, PanResponder, Pressable, StyleSheet, View } from 'react-native'

const BUTTON_SIZE = 60

export default function ChatButton() {
  const router = useRouter()
  const pathname = usePathname()

  const { width, height } = Dimensions.get('window')
  const initialX = useMemo(() => Math.max(8, width - 16 - BUTTON_SIZE), [width])
  const initialY = useMemo(() => Math.max(8, height - 96 - BUTTON_SIZE), [height])

  const pan = useRef(new Animated.ValueXY({ x: initialX, y: initialY })).current
  const startPos = useRef({ x: initialX, y: initialY })

  const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max)

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_evt, gesture) => Math.abs(gesture.dx) + Math.abs(gesture.dy) > 4,
      onPanResponderGrant: () => {
        // Capture current position as the base
        // @ts-ignore - extract is available on Animated.ValueXY
        const current = pan.__getValue?.() || { x: initialX, y: initialY }
        startPos.current = current
      },
      onPanResponderMove: (_evt, gesture) => {
        const xMin = 8
        const xMax = width - BUTTON_SIZE - 8
        const yMin = 8
        const yMax = height - BUTTON_SIZE - 8
        const nextX = clamp(startPos.current.x + gesture.dx, xMin, xMax)
        const nextY = clamp(startPos.current.y + gesture.dy, yMin, yMax)
        pan.setValue({ x: nextX, y: nextY })
      },
      onPanResponderRelease: () => {
        // No-op, position already set
      },
      onPanResponderTerminate: () => {
        // No-op
      },
    })
  ).current

  // Hide on auth flow screens and on chat screen itself (after hooks to keep hook order stable)
  const isHidden = pathname?.startsWith('/auth') || pathname === '/chat'
  if (isHidden) return null

  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <Animated.View style={[styles.animated, { transform: [{ translateX: pan.x }, { translateY: pan.y }] }]} {...panResponder.panHandlers}>
        <Pressable
          onPress={() => router.push('/chat')}
          android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: true }}
          style={styles.buttonShadow}
        >
          <LinearGradient
            colors={['#FF6B35', '#FF1493']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Ionicons name="chatbubble-ellipses" size={26} color="#ffffff" />
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    zIndex: 100,
  },
  animated: {
    position: 'absolute',
  },
  buttonShadow: {
    borderRadius: 30,
    shadowColor: '#FF1493',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 12,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
})


