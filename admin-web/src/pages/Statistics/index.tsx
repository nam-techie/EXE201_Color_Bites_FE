import {
    BarChart3,
    CreditCard,
    FileText,
    Store,
    TrendingUp,
    Users
} from 'lucide-react'
import { Card, Col, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import LoadingState from '../../components/common/LoadingState'
import StatCard from '../../components/common/StatCard'
import BarChart from '../../components/charts/BarChart'
import LineChart from '../../components/charts/LineChart'
import PieChart from '../../components/charts/PieChart'
import { statisticsApi } from '../../services/statisticsApi'
import { formatNumber } from '../../utils/formatters'

interface SystemStats {
  totalUsers: number
  activeUsers: number
  blockedUsers: number
  totalPosts: number
  deletedPosts: number
  activePosts: number
  totalRestaurants: number
  deletedRestaurants: number
  activeRestaurants: number
  totalTransactions: number
}

const StatisticsOverview: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch system statistics
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await statisticsApi.getSystemStatistics()
        setStats(response.data)
      } catch (err) {
        console.error('Error fetching statistics:', err)
        setError(err instanceof Error ? err.message : 'Không thể tải thống kê')
      } finally {
        setLoading(false)
      }
    }

    fetchStatistics()
  }, [])

  // Mock data for charts (sẽ được thay thế bằng real data)
  const userGrowthData = [
    { month: 'T1', users: 100, posts: 50 },
    { month: 'T2', users: 150, posts: 75 },
    { month: 'T3', users: 200, posts: 100 },
    { month: 'T4', users: 250, posts: 125 },
    { month: 'T5', users: 300, posts: 150 },
    { month: 'T6', users: 350, posts: 175 }
  ]

  const contentTypeData = [
    { name: 'Bài viết', value: stats?.totalPosts || 0, color: '#1890ff' },
    { name: 'Nhà hàng', value: stats?.totalRestaurants || 0, color: '#52c41a' },
    { name: 'Giao dịch', value: stats?.totalTransactions || 0, color: '#faad14' }
  ]

  const userStatusData = [
    { name: 'Hoạt động', value: stats?.activeUsers || 0, color: '#52c41a' },
    { name: 'Bị chặn', value: stats?.blockedUsers || 0, color: '#ff4d4f' }
  ]

  const statCards = stats ? [
    {
      title: 'Tổng người dùng',
      value: formatNumber(stats.totalUsers),
      icon: <Users className="w-6 h-6" />,
      color: '#1890ff',
      change: {
        value: Math.round(((stats.activeUsers / stats.totalUsers) * 100) - 100),
        type: 'increase' as const,
        label: `${stats.activeUsers} hoạt động`
      }
    },
    {
      title: 'Tổng bài viết',
      value: formatNumber(stats.totalPosts),
      icon: <FileText className="w-6 h-6" />,
      color: '#52c41a',
      change: {
        value: Math.round(((stats.activePosts / stats.totalPosts) * 100) - 100),
        type: 'increase' as const,
        label: `${stats.activePosts} hoạt động`
      }
    },
    {
      title: 'Tổng nhà hàng',
      value: formatNumber(stats.totalRestaurants),
      icon: <Store className="w-6 h-6" />,
      color: '#faad14',
      change: {
        value: Math.round(((stats.activeRestaurants / stats.totalRestaurants) * 100) - 100),
        type: 'increase' as const,
        label: `${stats.activeRestaurants} hoạt động`
      }
    },
    {
      title: 'Tổng giao dịch',
      value: formatNumber(stats.totalTransactions),
      icon: <CreditCard className="w-6 h-6" />,
      color: '#722ed1',
      change: {
        value: 0,
        type: 'increase' as const,
        label: 'Tổng số giao dịch'
      }
    }
  ] : []

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thống kê tổng quan</h1>
          <p className="text-gray-600">Tổng quan về hoạt động của hệ thống</p>
        </div>
      </div>

      {/* Stats Cards */}
      <LoadingState
        loading={loading}
        error={error}
        empty={!loading && !stats}
        emptyText="Không có dữ liệu thống kê"
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
          <Card title="Tăng trưởng người dùng và bài viết" className="h-full">
            <LineChart
              data={userGrowthData}
              dataKey="users"
              xAxisKey="month"
              lines={[
                { dataKey: 'users', name: 'Người dùng', color: '#1890ff' },
                { dataKey: 'posts', name: 'Bài viết', color: '#52c41a' }
              ]}
              height={300}
              tooltipFormatter={(value, name) => [formatNumber(Number(value)), name]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Phân bố nội dung" className="h-full">
            <PieChart
              data={contentTypeData}
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
          <Card title="Trạng thái người dùng" className="h-full">
            <PieChart
              data={userStatusData}
              height={250}
              showLabel={true}
              labelFormatter={(entry) => `${entry.value}`}
              tooltipFormatter={(value, name) => [formatNumber(Number(value)), name]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Hoạt động theo tháng" className="h-full">
            <BarChart
              data={userGrowthData}
              xAxisKey="month"
              bars={[
                { dataKey: 'users', name: 'Người dùng', color: '#1890ff' },
                { dataKey: 'posts', name: 'Bài viết', color: '#52c41a' }
              ]}
              height={250}
              tooltipFormatter={(value, name) => [formatNumber(Number(value)), name]}
            />
          </Card>
        </Col>
      </Row>

      {/* Additional Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Tỷ lệ người dùng hoạt động</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats ? Math.round((stats.activePosts / stats.totalPosts) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Tỷ lệ bài viết hoạt động</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {stats ? Math.round((stats.activeRestaurants / stats.totalRestaurants) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Tỷ lệ nhà hàng hoạt động</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats ? Math.round(stats.totalTransactions / stats.totalUsers) : 0}
            </div>
            <div className="text-sm text-gray-600">Giao dịch trung bình/người dùng</div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default StatisticsOverview
