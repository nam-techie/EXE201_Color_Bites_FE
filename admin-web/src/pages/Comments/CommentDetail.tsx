import { Button, Card, Descriptions, Space, Tag } from 'antd'
import React from 'react'
import type { Comment } from '../../types/comment'
import { displayValue, formatDate } from '../../utils/formatters'

interface CommentDetailProps {
  comment: Comment
  onClose: () => void
  onUpdate: () => void
}

const CommentDetail: React.FC<CommentDetailProps> = ({ 
  comment, 
  onClose, 
  onUpdate 
}) => {
  const getStatusConfig = (isDeleted: boolean) => {
    return isDeleted 
      ? { color: 'red', text: 'Đã xóa' }
      : { color: 'green', text: 'Hoạt động' }
  }

  const statusConfig = getStatusConfig(comment.isDeleted)

  return (
    <div className="space-y-4">
      {/* Comment Content */}
      <Card title="Nội dung bình luận" size="small">
        <div className="whitespace-pre-wrap text-gray-800">
          {displayValue(comment.content)}
        </div>
      </Card>

      {/* Comment Information */}
      <Card title="Thông tin bình luận" size="small">
        <Descriptions column={1} size="small">
          <Descriptions.Item label="ID">
            <code className="text-xs">{displayValue(comment.id)}</code>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={statusConfig.color}>{statusConfig.text}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Người dùng">
            {displayValue(comment.accountName)}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {displayValue(comment.authorEmail || comment.accountId)}
          </Descriptions.Item>
          <Descriptions.Item label="Bài viết">
            {displayValue(comment.postTitle)}
          </Descriptions.Item>
          <Descriptions.Item label="Số phản hồi">
            {displayValue(comment.replyCount, '0')}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {formatDate(comment.createdAt, 'DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item label="Cập nhật lần cuối">
            {formatDate(comment.updatedAt, 'DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Actions */}
      <div className="flex justify-end">
        <Space>
          <Button onClick={onClose}>
            Đóng
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default CommentDetail