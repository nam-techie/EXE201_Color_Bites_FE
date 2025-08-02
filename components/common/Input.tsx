'use client'

import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

interface InputProps {
   label?: string
   placeholder?: string
   value: string
   onChangeText: (text: string) => void
   secureTextEntry?: boolean
   keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'
   error?: string
   disabled?: boolean
   multiline?: boolean
   numberOfLines?: number
   leftIcon?: keyof typeof Ionicons.glyphMap
   rightIcon?: keyof typeof Ionicons.glyphMap
   onRightIconPress?: () => void
}

export default function Input({
   label,
   placeholder,
   value,
   onChangeText,
   secureTextEntry = false,
   keyboardType = 'default',
   error,
   disabled = false,
   multiline = false,
   numberOfLines = 1,
   leftIcon,
   rightIcon,
   onRightIconPress,
}: InputProps) {
   const [isFocused, setIsFocused] = useState(false)
   const [showPassword, setShowPassword] = useState(false)

   const togglePasswordVisibility = () => setShowPassword(!showPassword)

   return (
      <View style={styles.wrapper}>
         {label && <Text style={styles.label}>{label}</Text>}

         <View
            style={[
               styles.inputContainer,
               isFocused && styles.focused,
               error && styles.errorBorder,
               disabled && styles.disabled,
            ]}
         >
            {leftIcon && (
               <Ionicons
                  name={leftIcon}
                  size={20}
                  color={isFocused ? '#f97316' : '#9ca3af'}
                  style={styles.icon}
               />
            )}

            <TextInput
               style={[
                  styles.input,
                  multiline && styles.multiline,
                  disabled && styles.inputDisabled,
               ]}
               placeholder={placeholder}
               placeholderTextColor="#9ca3af"
               value={value}
               onChangeText={onChangeText}
               secureTextEntry={secureTextEntry && !showPassword}
               keyboardType={keyboardType}
               editable={!disabled}
               multiline={multiline}
               numberOfLines={numberOfLines}
               onFocus={() => setIsFocused(true)}
               onBlur={() => setIsFocused(false)}
               textAlignVertical={multiline ? 'top' : 'center'}
            />

            {secureTextEntry && (
               <TouchableOpacity onPress={togglePasswordVisibility}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#9ca3af" />
               </TouchableOpacity>
            )}

            {rightIcon && !secureTextEntry && (
               <TouchableOpacity onPress={onRightIconPress}>
                  <Ionicons name={rightIcon} size={20} color="#9ca3af" />
               </TouchableOpacity>
            )}
         </View>

         {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
   )
}

const styles = StyleSheet.create({
   wrapper: {
      marginBottom: 16,
   },
   label: {
      marginBottom: 6,
      fontSize: 14,
      fontWeight: '500',
      color: '#374151',
   },
   inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#d1d5db',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: Platform.OS === 'ios' ? 12 : 8,
      backgroundColor: '#fff',
   },
   focused: {
      borderColor: '#f97316',
   },
   errorBorder: {
      borderColor: '#ef4444',
   },
   disabled: {
      backgroundColor: '#f3f4f6',
   },
   icon: {
      marginRight: 8,
   },
   input: {
      flex: 1,
      fontSize: 16,
      color: '#111827',
      paddingVertical: 0,
      alignSelf: 'center',
   },
   multiline: {
      minHeight: 80,
      textAlignVertical: 'top',
   },
   inputDisabled: {
      color: '#9ca3af',
   },
   errorText: {
      marginTop: 4,
      fontSize: 13,
      color: '#ef4444',
   },
})
