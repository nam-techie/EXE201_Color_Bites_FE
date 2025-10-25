import React, { createContext, useContext, useState, useCallback } from 'react'
import { message, notification } from 'antd'
import { CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

interface ToastContextType {
  showSuccess: (content: string, duration?: number) => void
  showError: (content: string, duration?: number) => void
  showWarning: (content: string, duration?: number) => void
  showInfo: (content: string, duration?: number) => void
  showNotification: (config: NotificationConfig) => void
}

interface NotificationConfig {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
  placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: React.ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification()

  const showSuccess = useCallback((content: string, duration = 3) => {
    message.success({
      content,
      duration,
      icon: <CheckCircleOutlined className="text-green-500" />
    })
  }, [])

  const showError = useCallback((content: string, duration = 5) => {
    message.error({
      content,
      duration,
      icon: <CloseCircleOutlined className="text-red-500" />
    })
  }, [])

  const showWarning = useCallback((content: string, duration = 4) => {
    message.warning({
      content,
      duration,
      icon: <ExclamationCircleOutlined className="text-yellow-500" />
    })
  }, [])

  const showInfo = useCallback((content: string, duration = 3) => {
    message.info({
      content,
      duration,
      icon: <InfoCircleOutlined className="text-blue-500" />
    })
  }, [])

  const showNotification = useCallback((config: NotificationConfig) => {
    const { type, title, description, duration = 4.5, placement = 'topRight' } = config

    const iconMap = {
      success: <CheckCircleOutlined className="text-green-500" />,
      error: <CloseCircleOutlined className="text-red-500" />,
      warning: <ExclamationCircleOutlined className="text-yellow-500" />,
      info: <InfoCircleOutlined className="text-blue-500" />
    }

    api[type]({
      message: title,
      description,
      duration,
      placement,
      icon: iconMap[type],
      style: {
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }
    })
  }, [api])

  const value: ToastContextType = {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showNotification
  }

  return (
    <ToastContext.Provider value={value}>
      {contextHolder}
      {children}
    </ToastContext.Provider>
  )
}

// Convenience hooks for specific use cases
export const useSuccessToast = () => {
  const { showSuccess } = useToast()
  return showSuccess
}

export const useErrorToast = () => {
  const { showError } = useToast()
  return showError
}

export const useWarningToast = () => {
  const { showWarning } = useToast()
  return showWarning
}

export const useInfoToast = () => {
  const { showInfo } = useToast()
  return showInfo
}

export const useNotificationToast = () => {
  const { showNotification } = useToast()
  return showNotification
}

// Pre-configured toast functions for common scenarios
export const useApiToast = () => {
  const { showSuccess, showError, showWarning } = useToast()

  return {
    onSuccess: (message: string) => showSuccess(message),
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Đã xảy ra lỗi'
      showError(errorMessage)
    },
    onWarning: (message: string) => showWarning(message)
  }
}

export default ToastProvider
