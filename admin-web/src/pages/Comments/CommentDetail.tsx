import { Button, Card, Descriptions, Space, Tag } from 'antd'
import React from 'react'
import type { Comment } from '../../types/comment'

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
  const getStatusConfig = (status: string) => {
    const configs = {
      active: { color: 'green', text: 'Hoạt động' },
      hidden: { color: 'orange', text: 'Ẩn' },
      reported: { color: 'red', text: 'Báo cáo' }
    }
    return configs[status as keyof typeof configs] || { color: 'default', text: status }
  }

  const statusConfig = getStatusConfig(comment.status)

  return (
    <div className="space-y-4">
      {/* Comment Content */}
      <Card title="Nội dung bình luận" size="small">
        <div className="whitespace-pre-wrap text-gray-800">
          {comment.content}
        </div>
      </Card>

      {/* Comment Information */}
      <Card title="Thông tin bình luận" size="small">
        <Descriptions column={1} size="small">
          <Descriptions.Item label="ID">
            <code className="text-xs">{comment.id}</code>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={statusConfig.color}>{statusConfig.text}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Người dùng">
            {comment.user?.name || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {comment.user?.email || comment.userId}
          </Descriptions.Item>
          <Descriptions.Item label="Bài viết">
            {comment.post?.title || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {new Date(comment.createdAt).toLocaleString('vi-VN')}
          </Descriptions.Item>
          {comment.updatedAt && (
            <Descriptions.Item label="Cập nhật lần cuối">
              {new Date(comment.updatedAt).toLocaleString('vi-VN')}
            </Descriptions.Item>
          )}
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