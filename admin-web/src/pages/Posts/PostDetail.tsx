import {
    CalendarOutlined,
    DeleteOutlined,
    HeartOutlined,
    MessageOutlined,
    ShareAltOutlined,
    UndoOutlined,
    UserOutlined
} from '@ant-design/icons'
import {
    Button,
    Card,
    Col,
    Descriptions,
    message,
    Row,
    Space,
    Statistic,
    Tag,
    Tooltip
} from 'antd'
import React, { useEffect, useState } from 'react'
import ConfirmModal from '../../components/common/ConfirmModal'
import { useConfirm } from '../../hooks/useConfirm'
import { postsApi } from '../../services/postsApi'
import type { PostDetail as PostDetailType, PostResponse } from '../../types/post'
import { formatDate, formatRelativeTime } from '../../utils/formatters'

interface PostDetailProps {
  post: PostResponse
  onClose: () => void
  onUpdate: () => void
}

const PostDetail: React.FC<PostDetailProps> = ({ post, onClose, onUpdate }) => {
  const [postDetail, setPostDetail] = useState<PostDetailType | null>(null)
  const [loading, setLoading] = useState(false)
  const { confirm, modalProps } = useConfirm()

  // Fetch detailed post information
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true)
        const response = await postsApi.getPostDetail(post.id)
        setPostDetail(response.data)
      } catch (error) {
        console.error('Error fetching post detail:', error)
        message.error('Không thể tải chi tiết bài viết')
      } finally {
        setLoading(false)
      }
    }

    fetchPostDetail()
  }, [post.id])

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Xóa bài viết',
      content: 'Bạn có chắc chắn muốn xóa bài viết này?',
      type: 'warning'
    })
    
    if (confirmed) {
      try {
        await postsApi.deletePost(post.id)
        message.success('Xóa bài viết thành công')
        onUpdate()
        onClose()
      } catch (error) {
        message.error('Không thể xóa bài viết')
      }
    }
  }

  const handleRestore = async () => {
    const confirmed = await confirm({
      title: 'Khôi phục bài viết',
      content: 'Bạn có chắc chắn muốn khôi phục bài viết này?',
      type: 'info'
    })
    
    if (confirmed) {
      try {
        await postsApi.restorePost(post.id)
        message.success('Khôi phục bài viết thành công')
        onUpdate()
        onClose()
      } catch (error) {
        message.error('Không thể khôi phục bài viết')
      }
    }
  }

  const getStatusColor = (isDeleted: boolean) => {
    return isDeleted ? '#ff4d4f' : '#52c41a'
  }

  const getStatusText = (isDeleted: boolean) => {
    return isDeleted ? 'Đã xóa' : 'Hoạt động'
  }

  return (
    <div className="space-y-4">
      {/* Post Content */}
      <Card title="Nội dung bài viết" loading={loading}>
        <div style={{ 
          padding: '16px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <p style={{ 
            fontSize: '16px', 
            lineHeight: '1.6', 
            margin: 0,
            whiteSpace: 'pre-wrap'
          }}>
            {post.content}
          </p>
        </div>
      </Card>

      {/* Post Statistics */}
      <Card title="Thống kê tương tác">
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="Lượt thích"
              value={post.reactionCount}
              prefix={<HeartOutlined style={{ color: '#ff4d4f' }} />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Bình luận"
              value={post.commentCount}
              prefix={<MessageOutlined style={{ color: '#1890ff' }} />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Trạng thái"
              value={getStatusText(post.isDeleted)}
              valueStyle={{ color: getStatusColor(post.isDeleted) }}
            />
          </Col>
        </Row>
      </Card>

      {/* Author Information */}
      <Card title="Thông tin tác giả">
        <Descriptions column={1} size="small">
          <Descriptions.Item label="Tên tác giả">
            <Space>
              <UserOutlined />
              {post.accountName}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {post.authorEmail}
          </Descriptions.Item>
          <Descriptions.Item label="Vai trò">
            <Tag color="blue">{post.authorRole}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái tài khoản">
            <Tag color={post.authorIsActive ? 'green' : 'red'}>
              {post.authorIsActive ? 'Hoạt động' : 'Bị chặn'}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Post Metadata */}
      <Card title="Thông tin bài viết">
        <Descriptions column={1} size="small">
          <Descriptions.Item label="Tâm trạng">
            <Tag color="purple">{post.moodName}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            <Space>
              <CalendarOutlined />
              {formatDate(post.createdAt, 'DD/MM/YYYY HH:mm')}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Cập nhật lần cuối">
            <Space>
              <CalendarOutlined />
              {formatDate(post.updatedAt, 'DD/MM/YYYY HH:mm')}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian tương đối">
            {formatRelativeTime(post.createdAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Tags (if available) */}
      {postDetail?.tags && postDetail.tags.length > 0 && (
        <Card title="Thẻ tag">
          <Space wrap>
            {postDetail.tags.map(tag => (
              <Tag key={tag.id} color="blue">
                {tag.name}
              </Tag>
            ))}
          </Space>
        </Card>
      )}

      {/* Location (if available) */}
      {postDetail?.location && (
        <Card title="Vị trí">
          <p>{postDetail.location.address}</p>
          <p style={{ fontSize: '12px', color: '#666' }}>
            Tọa độ: {postDetail.location.latitude}, {postDetail.location.longitude}
          </p>
        </Card>
      )}

      {/* Action Buttons */}
      <Card>
        <Space>
          <Tooltip title="Chia sẻ">
            <Button icon={<ShareAltOutlined />}>
              Chia sẻ
            </Button>
          </Tooltip>
          
          {!post.isDeleted ? (
            <Tooltip title="Xóa bài viết">
              <Button 
                danger 
                icon={<DeleteOutlined />}
                onClick={handleDelete}
              >
                Xóa
              </Button>
            </Tooltip>
          ) : (
            <Tooltip title="Khôi phục bài viết">
              <Button 
                type="primary"
                icon={<UndoOutlined />}
                onClick={handleRestore}
              >
                Khôi phục
              </Button>
            </Tooltip>
          )}
        </Space>
      </Card>

      {/* Confirm Modal */}
      <ConfirmModal {...modalProps} />
    </div>
  )
}

export default PostDetail
