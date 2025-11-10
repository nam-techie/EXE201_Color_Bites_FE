import { CheckOutlined, CloseOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Card, Descriptions, Drawer, message, Space, Tag, Timeline } from 'antd'
import React, { useState } from 'react'
import { useConfirm } from '../../hooks/useConfirm'
import { transactionsApi } from '../../services/transactionsApi'
import type { Transaction } from '../../types/transaction'
import { TRANSACTION_STATUS_CONFIG } from '../../types/transaction'
import { displayCurrency, displayValue, formatDate } from '../../utils/formatters'

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

  // Handle status change
  const handleStatusChange = async (newStatus: 'SUCCESS' | 'FAILED' | 'CANCELED') => {
    const statusLabels = {
      SUCCESS: 'Thành công',
      FAILED: 'Thất bại', 
      CANCELED: 'Đã hủy'
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
      } catch {
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
              {displayCurrency(transaction.amount)}
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">💰</span>
              <span className="font-medium">{displayValue(transaction.type)}</span>
            </div>
          </div>
          
          <Descriptions column={1} size="small">
            <Descriptions.Item label="ID giao dịch">
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                {displayValue(transaction.id)}
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
                {displayValue(statusConfig.label)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Cổng thanh toán">
              <span className="text-gray-600">
                {displayValue(transaction.gateway)}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Mã đơn hàng">
              <span className="text-gray-600">
                {displayValue(transaction.orderCode)}
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
                {displayValue(transaction.accountId)}
              </code>
            </Descriptions.Item>
            <Descriptions.Item label="Tên">
              <div className="font-medium">{displayValue(transaction.accountName)}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              <div className="text-gray-600">{displayValue(transaction.accountEmail)}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái tài khoản">
              <span className={`px-2 py-1 rounded text-xs ${
                transaction.accountIsActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {transaction.accountIsActive ? 'Hoạt động' : 'Bị chặn'}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Vai trò">
              <span className="text-gray-600">{displayValue(transaction.accountRole)}</span>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Transaction Timeline */}
        <Card title="Lịch sử giao dịch">
          <Timeline>
            <Timeline.Item color="blue">
              <div className="text-sm">
                <div className="font-medium">Giao dịch được tạo</div>
                <div className="text-gray-500">
                  {formatDate(transaction.createdAt, 'DD/MM/YYYY HH:mm:ss')}
                </div>
                <div className="text-gray-500 text-xs">
                  Loại: {displayValue(transaction.type)} • Số tiền: {displayCurrency(transaction.amount)}
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
                    Trạng thái: {displayValue(statusConfig.label)}
                  </div>
                </div>
              </Timeline.Item>
            )}
          </Timeline>
        </Card>

        {/* Actions */}
        <Card title="Hành động">
          <Space wrap>
            {transaction.status === 'PENDING' && (
              <>
                <Button
                  icon={<CheckOutlined />}
                  type="primary"
                  onClick={() => handleStatusChange('SUCCESS')}
                  loading={loading}
                >
                  Duyệt giao dịch
                </Button>
                <Button
                  icon={<CloseOutlined />}
                  danger
                  onClick={() => handleStatusChange('FAILED')}
                  loading={loading}
                >
                  Từ chối giao dịch
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => handleStatusChange('CANCELED')}
                  loading={loading}
                >
                  Hủy giao dịch
                </Button>
              </>
            )}
            {transaction.status === 'SUCCESS' && (
              <div className="text-green-600 font-medium">
                 Giao dịch đã được duyệt thành công
              </div>
            )}
            {transaction.status === 'FAILED' && (
              <div className="text-red-600 font-medium">
                Giao dịch đã bị từ chối
              </div>
            )}
            {transaction.status === 'CANCELED' && (
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
