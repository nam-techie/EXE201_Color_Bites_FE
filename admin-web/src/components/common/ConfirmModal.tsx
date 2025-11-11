import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal, Space } from 'antd'
import React from 'react'

export interface ConfirmModalProps {
  visible: boolean
  title?: string
  content?: string
  okText?: string
  cancelText?: string
  type?: 'warning' | 'error' | 'info' | 'success'
  loading?: boolean
  onOk: () => void
  onCancel: () => void
  width?: number
  centered?: boolean
  maskClosable?: boolean
  keyboard?: boolean
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title = 'Xác nhận',
  content = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  okText = 'Xác nhận',
  cancelText = 'Hủy',
  type = 'warning',
  loading = false,
  onOk,
  onCancel,
  width = 416,
  centered = true,
  maskClosable = true,
  keyboard = true
}) => {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
      case 'success':
        return <ExclamationCircleOutlined style={{ color: '#52c41a' }} />
      case 'info':
        return <ExclamationCircleOutlined style={{ color: '#1890ff' }} />
      default:
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />
    }
  }

  const getOkButtonProps = () => {
    switch (type) {
      case 'error':
        return { danger: true }
      case 'success':
        return { type: 'primary' as const }
      default:
        return { type: 'primary' as const }
    }
  }

  return (
    <Modal
      title={
        <Space>
          {getIcon()}
          {title}
        </Space>
      }
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={width}
      centered={centered}
      maskClosable={maskClosable}
      keyboard={keyboard}
      confirmLoading={loading}
      okText={okText}
      cancelText={cancelText}
      okButtonProps={getOkButtonProps()}
    >
      <p>{content}</p>
    </Modal>
  )
}

export default ConfirmModal
