import {
    CalendarOutlined,
    DeleteOutlined,
    EnvironmentOutlined,
    GlobalOutlined,
    HeartOutlined,
    MailOutlined,
    PhoneOutlined,
    ShareAltOutlined,
    ShopOutlined,
    StarOutlined,
    UndoOutlined
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
import { restaurantsApi } from '../../services/restaurantsApi'
import type { RestaurantDetail as RestaurantDetailType, RestaurantResponse } from '../../types/restaurant'
import { displayValue, displayCurrency, displayNumber, formatDate, formatRelativeTime } from '../../utils/formatters'

interface RestaurantDetailProps {
  restaurant: RestaurantResponse
  onClose: () => void
  onUpdate: () => void
}

const RestaurantDetail: React.FC<RestaurantDetailProps> = ({ restaurant, onClose, onUpdate }) => {
  const [restaurantDetail, setRestaurantDetail] = useState<RestaurantDetailType | null>(null)
  const [loading, setLoading] = useState(false)
  const { confirm, modalProps } = useConfirm()

  // Fetch detailed restaurant information
  useEffect(() => {
    const fetchRestaurantDetail = async () => {
      try {
        setLoading(true)
        const response = await restaurantsApi.getRestaurantDetail(restaurant.id)
        setRestaurantDetail(response.data)
      } catch (error) {
        console.error('Error fetching restaurant detail:', error)
        message.error('Không thể tải chi tiết nhà hàng')
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurantDetail()
  }, [restaurant.id])

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Xóa nhà hàng',
      content: 'Bạn có chắc chắn muốn xóa nhà hàng này?',
      type: 'warning'
    })
    
    if (confirmed) {
      try {
        await restaurantsApi.deleteRestaurant(restaurant.id)
        message.success('Xóa nhà hàng thành công')
        onUpdate()
        onClose()
      } catch (error) {
        message.error('Không thể xóa nhà hàng')
      }
    }
  }

  const handleRestore = async () => {
    const confirmed = await confirm({
      title: 'Khôi phục nhà hàng',
      content: 'Bạn có chắc chắn muốn khôi phục nhà hàng này?',
      type: 'info'
    })
    
    if (confirmed) {
      try {
        await restaurantsApi.restoreRestaurant(restaurant.id)
        message.success('Khôi phục nhà hàng thành công')
        onUpdate()
        onClose()
      } catch (error) {
        message.error('Không thể khôi phục nhà hàng')
      }
    }
  }

  const getStatusColor = (isDeleted: boolean, featured: boolean) => {
    if (isDeleted) return '#ff4d4f'
    if (featured) return '#1890ff'
    return '#52c41a'
  }

  const getStatusText = (isDeleted: boolean, featured: boolean) => {
    if (isDeleted) return 'Đã xóa'
    if (featured) return 'Nổi bật'
    return 'Hoạt động'
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return '#52c41a'
    if (rating >= 4) return '#1890ff'
    if (rating >= 3) return '#faad14'
    return '#ff4d4f'
  }

  return (
    <div className="space-y-4">
      {/* Restaurant Basic Info */}
      <Card title="Thông tin cơ bản" loading={loading}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
            {displayValue(restaurant.name)}
            {restaurant.featured && (
              <StarOutlined style={{ color: '#faad14', marginLeft: 8 }} />
            )}
          </h2>
          <div style={{ 
            padding: '8px 12px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '6px',
            marginTop: '8px'
          }}>
            <EnvironmentOutlined style={{ marginRight: 8, color: '#666' }} />
            {displayValue(restaurant.address)}
          </div>
        </div>
        
        <div style={{ 
          padding: '12px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <p style={{ 
            fontSize: '14px', 
            lineHeight: '1.6', 
            margin: 0,
            whiteSpace: 'pre-wrap'
          }}>
            {displayValue(restaurant.description)}
          </p>
        </div>
      </Card>

      {/* Restaurant Statistics */}
      <Card title="Thống kê">
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="Đánh giá"
              value={displayValue(restaurant.rating?.toFixed(1), '0.0')}
              precision={1}
              suffix={<StarOutlined style={{ color: getRatingColor(restaurant.rating || 0) }} />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Giá trung bình"
              value={displayCurrency(restaurant.avgPrice, '0')}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Lượt yêu thích"
              value={displayNumber(restaurant.favoriteCount, '0')}
              prefix={<HeartOutlined style={{ color: '#ff4d4f' }} />}
            />
          </Col>
        </Row>
      </Card>

      {/* Restaurant Details */}
      <Card title="Chi tiết nhà hàng">
        <Descriptions column={1} size="small">
          <Descriptions.Item label="Loại nhà hàng">
            <Tag color="blue">{displayValue(restaurant.type, 'Chưa phân loại')}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Khu vực">
            {displayValue(restaurant.region, 'Chưa có khu vực')}
          </Descriptions.Item>
          <Descriptions.Item label="Tọa độ">
            <div style={{ fontSize: '12px', color: '#666' }}>
              <div>Kinh độ: {displayValue(restaurant.longitude)}</div>
              <div>Vĩ độ: {displayValue(restaurant.latitude)}</div>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={getStatusColor(restaurant.isDeleted, restaurant.featured)}>
              {getStatusText(restaurant.isDeleted, restaurant.featured)}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Creator Information */}
      <Card title="Thông tin người tạo">
        <Descriptions column={1} size="small">
          <Descriptions.Item label="Tên người tạo">
            <Space>
              <ShopOutlined />
              {displayValue(restaurant.createdByName)}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {displayValue(restaurant.creatorEmail)}
          </Descriptions.Item>
          <Descriptions.Item label="Vai trò">
            <Tag color="blue">{displayValue(restaurant.creatorRole)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái tài khoản">
            <Tag color={restaurant.creatorIsActive ? 'green' : 'red'}>
              {restaurant.creatorIsActive ? 'Hoạt động' : 'Bị chặn'}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Restaurant Metadata */}
      <Card title="Thông tin bổ sung">
        <Descriptions column={1} size="small">
          <Descriptions.Item label="Ngày tạo">
            <Space>
              <CalendarOutlined />
              {formatDate(restaurant.createdAt, 'DD/MM/YYYY HH:mm')}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian tương đối">
            {formatRelativeTime(restaurant.createdAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Contact Information (if available) */}
      {restaurantDetail?.contact && (
        <Card title="Thông tin liên hệ">
          <Space direction="vertical" style={{ width: '100%' }}>
            {restaurantDetail.contact.phone && (
              <div>
                <PhoneOutlined style={{ marginRight: 8 }} />
                {restaurantDetail.contact.phone}
              </div>
            )}
            {restaurantDetail.contact.email && (
              <div>
                <MailOutlined style={{ marginRight: 8 }} />
                {restaurantDetail.contact.email}
              </div>
            )}
            {restaurantDetail.contact.website && (
              <div>
                <GlobalOutlined style={{ marginRight: 8 }} />
                <a href={restaurantDetail.contact.website} target="_blank" rel="noopener noreferrer">
                  {restaurantDetail.contact.website}
                </a>
              </div>
            )}
          </Space>
        </Card>
      )}

      {/* Tags (if available) */}
      {restaurantDetail?.tags && restaurantDetail.tags.length > 0 && (
        <Card title="Thẻ tag">
          <Space wrap>
            {restaurantDetail.tags.map(tag => (
              <Tag key={tag.id} color="blue">
                {tag.name}
              </Tag>
            ))}
          </Space>
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
          
          {!restaurant.isDeleted ? (
            <Tooltip title="Xóa nhà hàng">
              <Button 
                danger 
                icon={<DeleteOutlined />}
                onClick={handleDelete}
              >
                Xóa
              </Button>
            </Tooltip>
          ) : (
            <Tooltip title="Khôi phục nhà hàng">
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

export default RestaurantDetail
