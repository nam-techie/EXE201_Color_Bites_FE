import { LoadingOutlined } from '@ant-design/icons'
import { Empty, Result, Spin } from 'antd'
import React from 'react'

export interface LoadingStateProps {
  loading?: boolean
  isRefreshing?: boolean // Trạng thái refresh riêng biệt
  error?: string | null
  empty?: boolean
  emptyText?: string
  emptyDescription?: string
  children?: React.ReactNode
  size?: 'small' | 'default' | 'large'
  tip?: string
  className?: string
}

const LoadingState: React.FC<LoadingStateProps> = ({
  loading = false,
  isRefreshing = false,
  error = null,
  empty = false,
  emptyText = 'Không có dữ liệu',
  emptyDescription = 'Không tìm thấy dữ liệu phù hợp',
  children,
  size = 'default',
  tip = 'Đang tải...',
  className = ''
}) => {
  // Show error state
  if (error) {
    return (
      <div className={`loading-state error ${className}`}>
        <Result
          status="error"
          title="Đã xảy ra lỗi"
          subTitle={error}
        />
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className={`loading-state loading ${className}`}>
        <Spin 
          size={size} 
          tip={tip}
          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
        />
      </div>
    )
  }

  // Show empty state
  if (empty) {
    return (
      <div className={`loading-state empty ${className}`}>
        <Empty
          description={
            <div>
              <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>
                {emptyText}
              </div>
              <div style={{ color: '#666' }}>
                {emptyDescription}
              </div>
            </div>
          }
        />
      </div>
    )
  }

  // Show children content with background refresh indicator
  return (
    <div className="relative">
      {children}
      {/* Background refresh indicator */}
      {isRefreshing && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-white rounded-full shadow-lg p-2 border">
            <Spin 
              size="small" 
              tip="Đang cập nhật..."
              indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default LoadingState
