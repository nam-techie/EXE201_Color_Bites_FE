import React from 'react'
import { View, Text, TextInput, TextInputProps } from 'react-native'
import { commonStyles } from '@/styles/commonStyles'
import { theme } from '@/styles/theme'

interface FormFieldProps extends TextInputProps {
  label: string
  error?: string
}

export function FormField({ label, error, style, ...textInputProps }: FormFieldProps) {
  return (
    <View style={commonStyles.section}>
      <Text style={commonStyles.label}>{label}</Text>
      <TextInput
        style={[
          textInputProps.multiline ? commonStyles.textInputMultiline : commonStyles.textInput,
          error && { borderColor: theme.colors.status.error },
          style,
        ]}
        placeholderTextColor={theme.colors.text.placeholder}
        {...textInputProps}
      />
      {error && (
        <Text style={{
          marginTop: theme.spacing.xs,
          fontSize: theme.fontSize.xs,
          color: theme.colors.status.error,
        }}>
          {error}
        </Text>
      )}
    </View>
  )
}
