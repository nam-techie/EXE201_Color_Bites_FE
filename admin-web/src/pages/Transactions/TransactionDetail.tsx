import { CheckOutlined, CloseOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Card, Descriptions, Drawer, message, Space, Tag, Timeline } from 'antd'
import React, { useState } from 'react'
import { useConfirm } from '../../hooks/useConfirm'
import { transactionsApi } from '../../services/transactionsApi'
import type { Transaction } from '../../types/transaction'
import { TRANSACTION_STATUS_CONFIG, TRANSACTION_TYPE_CONFIG } from '../../types/transaction'
import { formatCurrency, formatDate } from '../../utils/formatters'

interface TransactionDetailProps {
  visible: boolean
  transaction: Transaction | null
  onClose: () => void
  onUpdate: () => void
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({
  visible,
  transaction,
  onClose,
  onUpdate
}) => {
  const [loading, setLoading] = useState(false)
  const { confirm } = useConfirm()

  if (!transaction) return null

  // Status configuration
  const statusConfig = TRANSACTION_STATUS_CONFIG[transaction.status]
  const typeConfig = TRANSACTION_TYPE_CONFIG[transaction.type]

  // Handle status change
  const handleStatusChange = async (newStatus: 'completed' | 'failed' | 'cancelled') => {
    const statusLabels = {
      completed: 'Hoàn thành',
      failed: 'Thất bại', 
      cancelled: 'Đã hủy'
    }

    const confirmed = await confirm({
      title: 'Thay đổi trạng thái giao dịch',
      content: `Bạn có chắc chắn muốn thay đổi trạng thái giao dịch thành "${statusLabels[newStatus]}"?`,
      type: 'warning'
    })

    if (confirmed) {
      setLoading(true)
      try {
        await transactionsApi.updateTransactionStatus(transaction.id, { status: newStatus })
        message.success('Cập nhật trạng thái thành công')
        onUpdate()
        onClose()
      } catch (error) {
        message.error('Không thể cập nhật trạng thái')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Drawer
      title="Chi tiết giao dịch"
      placement="right"
      width={600}
      open={visible}
      onClose={onClose}
      destroyOnClose
    >
      <div className="space-y-6">
        {/* Transaction Overview */}
        <Card title="Thông tin giao dịch">
          <div className="text-center mb-4">
            <div className={`text-3xl font-bold mb-2 ${
              transaction.type === 'deposit' || transaction.type === 'reward' 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {transaction.type === 'deposit' || transaction.type === 'reward' ? '+' : '-'}
              {formatCurrency(transaction.amount)}
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">{typeConfig.icon}</span>
              <span className="font-medium">{typeConfig.label}</span>
            </div>
          </div>
          
          <Descriptions column={1} size="small">
            <Descriptions.Item label="ID giao dịch">
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                {transaction.id}
              </code>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag 
                color={statusConfig.color}
                style={{
                  backgroundColor: statusConfig.bgColor,
                  color: statusConfig.textColor,
                  border: 'none'
                }}
              >
                {statusConfig.label}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả">
              <span className="text-gray-600">
                {transaction.description || 'Không có mô tả'}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {formatDate(transaction.createdAt, 'DD/MM/YYYY HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="Cập nhật lần cuối">
              {formatDate(transaction.updatedAt, 'DD/MM/YYYY HH:mm:ss')}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* User Information */}
        <Card title="Thông tin người dùng">
          <Descriptions column={1} size="small">
            <Descriptions.Item label="ID người dùng">
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                {transaction.userId}
              </code>
            </Descriptions.Item>
            {transaction.user && (
              <>
                <Descriptions.Item label="Tên">
                  <div className="font-medium">{transaction.user.name}</div>
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  <div className="text-gray-600">{transaction.user.email}</div>
                </Descriptions.Item>
                {transaction.user.avatar && (
                  <Descriptions.Item label="Avatar">
                    <img 
                      src={transaction.user.avatar} 
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full"
                    />
                  </Descriptions.Item>
                )}
              </>
            )}
          </Descriptions>
        </Card>

        {/* Transaction Timeline */}
        <Card title="Lịch sử giao dịch">
          <Timeline size="small">
            <Timeline.Item color="blue">
              <div className="text-sm">
                <div className="font-medium">Giao dịch được tạo</div>
                <div className="text-gray-500">
                  {formatDate(transaction.createdAt, 'DD/MM/YYYY HH:mm:ss')}
                </div>
                <div className="text-gray-500 text-xs">
                  Loại: {typeConfig.label} • Số tiền: {formatCurrency(transaction.amount)}
                </div>
              </div>
            </Timeline.Item>
            
            {transaction.updatedAt !== transaction.createdAt && (
              <Timeline.Item color="orange">
                <div className="text-sm">
                  <div className="font-medium">Giao dịch được cập nhật</div>
                  <div className="text-gray-500">
                    {formatDate(transaction.updatedAt, 'DD/MM/YYYY HH:mm:ss')}
                  </div>
                  <div className="text-gray-500 text-xs">
                    Trạng thái: {statusConfig.label}
                  </div>
                </div>
              </Timeline.Item>
            )}
          </Timeline>
        </Card>

        {/* Actions */}
        <Card title="Hành động">
          <Space wrap>
            {transaction.status === 'pending' && (
              <>
                <Button
                  icon={<CheckOutlined />}
                  type="primary"
                  onClick={() => handleStatusChange('completed')}
                  loading={loading}
                >
                  Duyệt giao dịch
                </Button>
                <Button
                  icon={<CloseOutlined />}
                  danger
                  onClick={() => handleStatusChange('failed')}
                  loading={loading}
                >
                  Từ chối giao dịch
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => handleStatusChange('cancelled')}
                  loading={loading}
                >
                  Hủy giao dịch
                </Button>
              </>
            )}
            {transaction.status === 'completed' && (
              <div className="text-green-600 font-medium">
                ✅ Giao dịch đã được duyệt thành công
              </div>
            )}
            {transaction.status === 'failed' && (
              <div className="text-red-600 font-medium">
                ❌ Giao dịch đã bị từ chối
              </div>
            )}
            {transaction.status === 'cancelled' && (
              <div className="text-gray-600 font-medium">
                ⏹️ Giao dịch đã bị hủy
              </div>
            )}
          </Space>
        </Card>
      </div>
    </Drawer>
  )
}

export default TransactionDetail
