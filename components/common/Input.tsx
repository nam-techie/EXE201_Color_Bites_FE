'use client'

import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'

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

   const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
   }

   return (
      <View className="mb-4">
         {label && <Text className="mb-2 text-sm font-medium text-gray-700">{label}</Text>}

         <View
            className={`
        flex-row items-center rounded-lg border px-3 py-3
        ${isFocused ? 'border-primary-500' : 'border-gray-300'}
        ${error ? 'border-red-500' : ''}
        ${disabled ? 'bg-gray-100' : 'bg-white'}
      `}
         >
            {leftIcon && (
               <Ionicons
                  name={leftIcon}
                  size={20}
                  color={isFocused ? '#f97316' : '#9ca3af'}
                  style={{ marginRight: 8 }}
               />
            )}

            <TextInput
               className="flex-1 text-base text-gray-900"
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

         {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
      </View>
   )
}
