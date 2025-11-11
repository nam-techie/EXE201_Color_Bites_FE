import { Card, Col, Row } from 'antd'
import { TrendingUp, UserCheck, Users, UserX } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import BarChart from '../../components/charts/BarChart'
import LineChart from '../../components/charts/LineChart'
import PieChart from '../../components/charts/PieChart'
import LoadingState from '../../components/common/LoadingState'
import StatCard from '../../components/common/StatCard'
import { statisticsApi } from '../../services/statisticsApi'
import { displayNumber, formatNumber } from '../../utils/formatters'

interface UserStats {
  totalUsers: number
  activeUsers: number
  blockedUsers: number
  newUsersThisMonth: number
  userGrowthRate: number
}

const UserAnalytics: React.FC = () => {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user statistics
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await statisticsApi.getUserStatistics()
        setStats(response.data as UserStats)
      } catch (err) {
        console.error('Error fetching user statistics:', err)
        setError(err instanceof Error ? err.message : 'Không thể tải thống kê người dùng')
      } finally {
        setLoading(false)
      }
    }

    fetchUserStats()
  }, [])

  // Mock data for charts
  const userGrowthData = [
    { month: 'T1', users: 100, newUsers: 20 },
    { month: 'T2', users: 150, newUsers: 30 },
    { month: 'T3', users: 200, newUsers: 25 },
    { month: 'T4', users: 250, newUsers: 35 },
    { month: 'T5', users: 300, newUsers: 40 },
    { month: 'T6', users: 350, newUsers: 45 }
  ]

  const userStatusData = [
    { name: 'Hoạt động', value: stats?.activeUsers || 0, color: '#52c41a' },
    { name: 'Bị chặn', value: stats?.blockedUsers || 0, color: '#ff4d4f' }
  ]

  const userActivityData = [
    { day: 'T2', active: 120, new: 15 },
    { day: 'T3', active: 135, new: 18 },
    { day: 'T4', active: 150, new: 22 },
    { day: 'T5', active: 165, new: 20 },
    { day: 'T6', active: 180, new: 25 },
    { day: 'T7', active: 195, new: 28 },
    { day: 'CN', active: 210, new: 30 }
  ]

  const statCards = stats ? [
    {
      title: 'Tổng người dùng',
      value: displayNumber(stats.totalUsers, '0'),
      icon: <Users className="w-6 h-6" />,
      color: '#1890ff',
      change: {
        value: stats.userGrowthRate,
        type: 'increase' as const,
        label: `Tăng trưởng ${stats.userGrowthRate}%`
      }
    },
    {
      title: 'Người dùng hoạt động',
      value: displayNumber(stats.activeUsers, '0'),
      icon: <UserCheck className="w-6 h-6" />,
      color: '#52c41a',
      change: {
        value: Math.round((stats.activeUsers / stats.totalUsers) * 100),
        type: 'increase' as const,
        label: `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% tổng số`
      }
    },
    {
      title: 'Người dùng bị chặn',
      value: displayNumber(stats.blockedUsers, '0'),
      icon: <UserX className="w-6 h-6" />,
      color: '#ff4d4f',
      change: {
        value: Math.round((stats.blockedUsers / stats.totalUsers) * 100),
        type: 'decrease' as const,
        label: `${Math.round((stats.blockedUsers / stats.totalUsers) * 100)}% tổng số`
      }
    },
    {
      title: 'Người dùng mới tháng này',
      value: displayNumber(stats.newUsersThisMonth, '0'),
      icon: <TrendingUp className="w-6 h-6" />,
      color: '#722ed1',
      change: {
        value: 0,
        type: 'increase' as const,
        label: 'Tháng hiện tại'
      }
    }
  ] : []

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <Users className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Phân tích người dùng</h1>
          <p className="text-gray-600">Thống kê chi tiết về người dùng trong hệ thống</p>
        </div>
      </div>

      {/* Stats Cards */}
      <LoadingState
        loading={loading}
        error={error}
        empty={!loading && !stats}
        emptyText="Không có dữ liệu thống kê người dùng"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              change={stat.change}
            />
          ))}
        </div>
      </LoadingState>

      {/* Charts Row 1 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Tăng trưởng người dùng theo tháng" className="h-full">
            <LineChart
              data={userGrowthData}
              xAxisKey="month"
              lines={[
                { dataKey: 'users', name: 'Tổng người dùng', color: '#1890ff' },
                { dataKey: 'newUsers', name: 'Người dùng mới', color: '#52c41a' }
              ]}
              height={300}
              tooltipFormatter={(value, name) => [formatNumber(Number(value)), name]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Trạng thái người dùng" className="h-full">
            <PieChart
              data={userStatusData}
              height={300}
              showLabel={true}
              labelFormatter={(entry) => `${entry.value}`}
              tooltipFormatter={(value, name) => [formatNumber(Number(value)), name]}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Hoạt động người dùng theo ngày trong tuần" className="h-full">
            <BarChart
              data={userActivityData}
              xAxisKey="day"
              bars={[
                { dataKey: 'active', name: 'Người dùng hoạt động', color: '#1890ff' },
                { dataKey: 'new', name: 'Người dùng mới', color: '#52c41a' }
              ]}
              height={250}
              tooltipFormatter={(value, name) => [formatNumber(Number(value)), name]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Tỷ lệ người dùng hoạt động" className="h-full">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {stats ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">Tỷ lệ người dùng hoạt động</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 mb-2">
                  {stats ? Math.round((stats.blockedUsers / stats.totalUsers) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">Tỷ lệ người dùng bị chặn</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Additional Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {displayNumber(stats?.totalUsers, '0')}
            </div>
            <div className="text-sm text-gray-600">Tổng người dùng</div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {displayNumber(stats?.activeUsers, '0')}
            </div>
            <div className="text-sm text-gray-600">Người dùng hoạt động</div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {displayNumber(stats?.blockedUsers, '0')}
            </div>
            <div className="text-sm text-gray-600">Người dùng bị chặn</div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default UserAnalytics
