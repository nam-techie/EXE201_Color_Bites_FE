import {
    ClockCircleOutlined,
    CrownOutlined,
    GiftOutlined,
    InfoCircleOutlined,
    UserOutlined
} from '@ant-design/icons'
import { Card, Col, Descriptions, message, Row, Space, Statistic } from 'antd'
import React, { useEffect, useState } from 'react'
import { adminApi } from '../../services/adminApi'
import { ListAccountResponse, UserInformationResponse } from '../../types/user'
import { displayValue, formatDate, formatRelativeTime } from '../../utils/formatters'

interface UserDetailProps {
  user: ListAccountResponse
  onClose: () => void
  onUpdate: () => void
}

const UserDetail: React.FC<UserDetailProps> = ({ user }) => {
  const [userInfo, setUserInfo] = useState<UserInformationResponse | null>(null)
  const [loading, setLoading] = useState(false)

  // Fetch detailed user information
  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        setLoading(true)
        const response = await adminApi.getUserInformation(user.id)
        setUserInfo(response.data)
      } catch (error) {
        console.error('Error fetching user detail:', error)
        message.error('Không thể tải chi tiết người dùng')
      } finally {
        setLoading(false)
      }
    }

    fetchUserDetail()
  }, [user.id])


  // Get subscription status text
  const getSubscriptionStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Đang hoạt động'
      case 'EXPIRED':
        return 'Đã hết hạn'
      case 'CANCELED':
        return 'Đã hủy'
      default:
        return 'Chưa đăng ký'
    }
  }

  // Get gender text
  const getGenderText = (gender: string) => {
    if (!gender) return 'Chưa có dữ liệu'
    switch (gender.toUpperCase()) {
      case 'MALE':
        return 'Nam'
      case 'FEMALE':
        return 'Nữ'
      case 'OTHER':
        return 'Khác'
      default:
        return gender
    }
  }

  // Get subscription plan text
  const getSubscriptionPlanText = (plan: string) => {
    if (!plan) return 'Chưa có dữ liệu'
    switch (plan.toUpperCase()) {
      case 'BASIC':
        return 'Gói cơ bản'
      case 'PREMIUM':
        return 'Gói cao cấp'
      case 'VIP':
        return 'Gói VIP'
      default:
        return plan
    }
  }

  return (
    <div className="space-y-4">
      {/* User Basic Information */}
      <Card 
        title={
          <Space>
            <UserOutlined />
            <span>Thông tin cơ bản</span>
          </Space>
        }
        loading={loading}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          {userInfo?.avatarUrl ? (
            <img
              src={userInfo.avatarUrl}
              alt={userInfo.username}
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #e8e8e8'
              }}
            />
          ) : (
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                backgroundColor: '#f0f0f0',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                color: '#999'
              }}
            >
              <UserOutlined />
            </div>
          )}
        </div>

         <Descriptions column={1} bordered size="small">
           <Descriptions.Item label="Tên người dùng">
             <strong>{displayValue(userInfo?.username || user.username)}</strong>
           </Descriptions.Item>
           <Descriptions.Item label="ID tài khoản">
             {displayValue(userInfo?.accountId || user.id)}
           </Descriptions.Item>
           <Descriptions.Item label="Giới tính">
             {userInfo?.gender ? getGenderText(userInfo.gender) : 'Chưa có dữ liệu'}
           </Descriptions.Item>
           <Descriptions.Item label="Giới thiệu">
             <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px', whiteSpace: 'pre-wrap' }}>
               {displayValue(userInfo?.bio, 'Chưa có dữ liệu')}
             </div>
           </Descriptions.Item>
         </Descriptions>
      </Card>

      {/* Subscription Information */}
      <Card 
        title={
          <Space>
            <CrownOutlined />
            <span>Thông tin gói đăng ký</span>
          </Space>
        }
        loading={loading}
      >
         <Row gutter={16}>
           <Col span={8}>
             <Statistic
               title="Gói đăng ký"
               value={userInfo?.subscriptionPlan ? getSubscriptionPlanText(userInfo.subscriptionPlan) : 'Chưa có dữ liệu'}
               prefix={<GiftOutlined style={{ color: '#1890ff' }} />}
             />
           </Col>
           <Col span={8}>
            <Statistic
              title="Trạng thái"
              value={userInfo?.subscriptionStatus ? getSubscriptionStatusText(userInfo.subscriptionStatus) : 'Chưa có dữ liệu'}
            />
           </Col>
          {userInfo?.subscriptionRemainingDays !== undefined && userInfo?.subscriptionRemainingDays !== null && (
            <Col span={8}>
              <Statistic
                title="Còn lại"
                value={userInfo.subscriptionRemainingDays}
                suffix="ngày"
                prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ color: userInfo.subscriptionRemainingDays < 7 ? '#ff4d4f' : '#52c41a' }}
              />
            </Col>
          )}
        </Row>

         <div style={{ marginTop: 24 }}>
           <Descriptions column={1} bordered size="small">
             <Descriptions.Item label="Ngày bắt đầu">
               {userInfo?.subscriptionStartsAt
                 ? formatDate(userInfo.subscriptionStartsAt, 'DD/MM/YYYY HH:mm')
                 : 'Chưa có dữ liệu'}
             </Descriptions.Item>
             <Descriptions.Item label="Ngày hết hạn">
               {userInfo?.subscriptionExpiresAt
                 ? formatDate(userInfo.subscriptionExpiresAt, 'DD/MM/YYYY HH:mm')
                 : 'Chưa có dữ liệu'}
             </Descriptions.Item>
           </Descriptions>
         </div>
      </Card>

      {/* Account Statistics */}
      <Card 
        title={
          <Space>
            <InfoCircleOutlined />
            <span>Thống kê tài khoản</span>
          </Space>
        }
        loading={loading}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              title="Trạng thái tài khoản"
              value={user.active ? 'Hoạt động' : 'Bị chặn'}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Vai trò"
              value={user.role}
            />
          </Col>
        </Row>

         <div style={{ marginTop: 24 }}>
           <Descriptions column={1} bordered size="small">
             <Descriptions.Item label="Ngày tạo tài khoản">
               {userInfo?.createdAt
                 ? formatDate(userInfo.createdAt, 'DD/MM/YYYY HH:mm')
                 : user.created ? formatDate(user.created, 'DD/MM/YYYY HH:mm') : 'Chưa có dữ liệu'}
               {userInfo?.createdAt && (
                 <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                   ({formatRelativeTime(userInfo.createdAt)})
                 </div>
               )}
               {!userInfo?.createdAt && user.created && (
                 <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                   ({formatRelativeTime(user.created)})
                 </div>
               )}
             </Descriptions.Item>
             <Descriptions.Item label="Cập nhật lần cuối">
               {userInfo?.updatedAt
                 ? formatDate(userInfo.updatedAt, 'DD/MM/YYYY HH:mm')
                 : user.updated ? formatDate(user.updated, 'DD/MM/YYYY HH:mm') : 'Chưa có dữ liệu'}
               {userInfo?.updatedAt && (
                 <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                   ({formatRelativeTime(userInfo.updatedAt)})
                 </div>
               )}
               {!userInfo?.updatedAt && user.updated && (
                 <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                   ({formatRelativeTime(user.updated)})
                 </div>
               )}
             </Descriptions.Item>
           </Descriptions>
         </div>
      </Card>
    </div>
  )
}

export default UserDetail

