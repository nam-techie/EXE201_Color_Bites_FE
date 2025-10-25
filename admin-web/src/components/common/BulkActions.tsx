import { DeleteOutlined, DownloadOutlined, MoreOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu, Modal, Progress, message } from 'antd'
import React, { useState } from 'react'

interface BulkActionsProps<T> {
  selectedItems: T[]
  onBulkDelete?: (items: T[]) => Promise<void>
  onBulkExport?: (items: T[]) => Promise<void>
  onBulkUpdate?: (items: T[], updates: any) => Promise<void>
  getItemKey: (item: T) => string
  getItemName: (item: T) => string
  disabled?: boolean
}

interface BulkOperation {
  key: string
  label: string
  icon: React.ReactNode
  danger?: boolean
  confirmMessage?: string
  onConfirm: (items: T[]) => Promise<void>
}

const BulkActions = <T,>({
  selectedItems,
  onBulkDelete,
  onBulkExport,
  onBulkUpdate,
  getItemKey,
  getItemName,
  disabled = false
}: BulkActionsProps<T>) => {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentOperation, setCurrentOperation] = useState<string | null>(null)

  const handleBulkOperation = async (operation: BulkOperation) => {
    if (selectedItems.length === 0) {
      message.warning('Vui lòng chọn ít nhất một mục')
      return
    }

    if (operation.confirmMessage) {
      Modal.confirm({
        title: operation.label,
        content: operation.confirmMessage,
        okText: 'Xác nhận',
        cancelText: 'Hủy',
        onOk: async () => {
          await executeBulkOperation(operation)
        }
      })
    } else {
      await executeBulkOperation(operation)
    }
  }

  const executeBulkOperation = async (operation: BulkOperation) => {
    try {
      setLoading(true)
      setCurrentOperation(operation.key)
      setProgress(0)

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      await operation.onConfirm(selectedItems)

      clearInterval(progressInterval)
      setProgress(100)

      message.success(`${operation.label} thành công cho ${selectedItems.length} mục`)
    } catch (error) {
      console.error('Bulk operation error:', error)
      message.error(`Không thể ${operation.label.toLowerCase()}`)
    } finally {
      setLoading(false)
      setCurrentOperation(null)
      setProgress(0)
    }
  }

  const bulkOperations: BulkOperation[] = [
    {
      key: 'delete',
      label: 'Xóa',
      icon: <DeleteOutlined />,
      danger: true,
      confirmMessage: `Bạn có chắc chắn muốn xóa ${selectedItems.length} mục đã chọn?`,
      onConfirm: onBulkDelete || (async () => {
        message.info('Tính năng xóa hàng loạt sẽ được triển khai')
      })
    },
    {
      key: 'export',
      label: 'Xuất Excel',
      icon: <DownloadOutlined />,
      onConfirm: onBulkExport || (async () => {
        message.info('Tính năng xuất Excel sẽ được triển khai')
      })
    }
  ]

  const menu = (
    <Menu>
      {bulkOperations.map((operation) => (
        <Menu.Item
          key={operation.key}
          icon={operation.icon}
          danger={operation.danger}
          onClick={() => handleBulkOperation(operation)}
        >
          {operation.label}
        </Menu.Item>
      ))}
    </Menu>
  )

  if (selectedItems.length === 0) {
    return null
  }

  return (
    <div className="flex items-center space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-blue-700">
          Đã chọn {selectedItems.length} mục
        </span>
        <Button
          type="link"
          size="small"
          onClick={() => {
            // Clear selection - this should be handled by parent component
            message.info('Vui lòng bỏ chọn các mục trong bảng')
          }}
        >
          Bỏ chọn tất cả
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Dropdown overlay={menu} trigger={['click']}>
          <Button
            icon={<MoreOutlined />}
            loading={loading}
            disabled={disabled}
          >
            Thao tác hàng loạt
          </Button>
        </Dropdown>
      </div>

      {/* Progress indicator */}
      {loading && currentOperation && (
        <div className="flex items-center space-x-2">
          <Progress
            percent={progress}
            size="small"
            status="active"
            className="w-20"
          />
          <span className="text-xs text-gray-600">
            {currentOperation === 'delete' ? 'Đang xóa...' : 
             currentOperation === 'export' ? 'Đang xuất...' : 'Đang xử lý...'}
          </span>
        </div>
      )}
    </div>
  )
}

export default BulkActions
