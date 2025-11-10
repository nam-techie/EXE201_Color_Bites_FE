import { Heart, MessageSquare, Share2, TrendingUp } from 'lucide-react'
import { Card, Col, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import LoadingState from '../../components/common/LoadingState'
import StatCard from '../../components/common/StatCard'
import BarChart from '../../components/charts/BarChart'
import LineChart from '../../components/charts/LineChart'
import PieChart from '../../components/charts/PieChart'
import { statisticsApi } from '../../services/statisticsApi'
import { displayNumber, formatNumber } from '../../utils/formatters'

interface EngagementStats {
  totalLikes: number
  totalComments: number
  totalShares: number
  avgEngagementRate: number
  topEngagedPosts: number
  dailyActiveUsers: number
}

const EngagementAnalytics: React.FC = () => {
  const [stats, setStats] = useState<EngagementStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch engagement statistics
  useEffect(() => {
    const fetchEngagementStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await statisticsApi.getEngagementStatistics()
        setStats(response.data as EngagementStats)
      } catch (err) {
        console.error('Error fetching engagement statistics:', err)
        setError(err instanceof Error ? err.message : 'Không thể tải thống kê tương tác')
      } finally {
        setLoading(false)
      }
    }

    fetchEngagementStats()
  }, [])

  // Mock data for charts
  const engagementData = [
    { month: 'T1', likes: 500, comments: 100, shares: 50 },
    { month: 'T2', likes: 750, comments: 150, shares: 75 },
    { month: 'T3', likes: 1000, comments: 200, shares: 100 },
    { month: 'T4', likes: 1250, comments: 250, shares: 125 },
    { month: 'T5', likes: 1500, comments: 300, shares: 150 },
    { month: 'T6', likes: 1750, comments: 350, shares: 175 }
  ]

  const engagementTypeData = [
    { name: 'Lượt thích', value: stats?.totalLikes || 0, color: '#ff4d4f' },
    { name: 'Bình luận', value: stats?.totalComments || 0, color: '#1890ff' },
    { name: 'Chia sẻ', value: stats?.totalShares || 0, color: '#52c41a' }
  ]

  const dailyEngagementData = [
    { day: 'T2', likes: 100, comments: 20, shares: 10 },
    { day: 'T3', likes: 120, comments: 25, shares: 12 },
    { day: 'T4', likes: 140, comments: 30, shares: 15 },
    { day: 'T5', likes: 160, comments: 35, shares: 18 },
    { day: 'T6', likes: 180, comments: 40, shares: 20 },
    { day: 'T7', likes: 200, comments: 45, shares: 22 },
    { day: 'CN', likes: 220, comments: 50, shares: 25 }
  ]

  const topPostsData = [
    { title: 'Bài viết về ẩm thực', likes: 150, comments: 30, shares: 15 },
    { title: 'Review nhà hàng', likes: 200, comments: 40, shares: 20 },
    { title: 'Chia sẻ trải nghiệm', likes: 180, comments: 35, shares: 18 },
    { title: 'Hướng dẫn nấu ăn', likes: 160, comments: 32, shares: 16 },
    { title: 'Khám phá món mới', likes: 140, comments: 28, shares: 14 }
  ]

  const statCards = stats ? [
    {
      title: 'Tổng lượt thích',
      value: displayNumber(stats.totalLikes, '0'),
      icon: <Heart className="w-6 h-6" />,
      color: '#ff4d4f',
      change: {
        value: 0,
        type: 'increase' as const,
        label: 'Tổng số lượt thích'
      }
    },
    {
      title: 'Tổng bình luận',
      value: displayNumber(stats.totalComments, '0'),
      icon: <MessageSquare className="w-6 h-6" />,
      color: '#1890ff',
      change: {
        value: 0,
        type: 'increase' as const,
        label: 'Tổng số bình luận'
      }
    },
    {
      title: 'Tổng chia sẻ',
      value: displayNumber(stats.totalShares, '0'),
      icon: <Share2 className="w-6 h-6" />,
      color: '#52c41a',
      change: {
        value: 0,
        type: 'increase' as const,
        label: 'Tổng số chia sẻ'
      }
    },
    {
      title: 'Tỷ lệ tương tác',
      value: `${stats.avgEngagementRate.toFixed(1)}%`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: '#722ed1',
      change: {
        value: stats.avgEngagementRate,
        type: 'increase' as const,
        label: 'Tỷ lệ tương tác trung bình'
      }
    }
  ] : []

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <Heart className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Phân tích tương tác</h1>
          <p className="text-gray-600">Thống kê chi tiết về tương tác và engagement</p>
        </div>
      </div>

      {/* Stats Cards */}
      <LoadingState
        loading={loading}
        error={error}
        empty={!loading && !stats}
        emptyText="Không có dữ liệu thống kê tương tác"
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
          <Card title="Tăng trưởng tương tác theo tháng" className="h-full">
            <LineChart
              data={engagementData}
              xAxisKey="month"
              lines={[
                { dataKey: 'likes', name: 'Lượt thích', color: '#ff4d4f' },
                { dataKey: 'comments', name: 'Bình luận', color: '#1890ff' },
                { dataKey: 'shares', name: 'Chia sẻ', color: '#52c41a' }
              ]}
              height={300}
              tooltipFormatter={(value, name) => [formatNumber(Number(value)), name]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Phân bố loại tương tác" className="h-full">
            <PieChart
              data={engagementTypeData}
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
          <Card title="Tương tác theo ngày trong tuần" className="h-full">
            <BarChart
              data={dailyEngagementData}
              xAxisKey="day"
              bars={[
                { dataKey: 'likes', name: 'Lượt thích', color: '#ff4d4f' },
                { dataKey: 'comments', name: 'Bình luận', color: '#1890ff' },
                { dataKey: 'shares', name: 'Chia sẻ', color: '#52c41a' }
              ]}
              height={250}
              tooltipFormatter={(value, name) => [formatNumber(Number(value)), name]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Bài viết có tương tác cao nhất" className="h-full">
            <div className="space-y-3">
              {topPostsData.map((post, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">{post.title}</div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-red-500">❤️ {post.likes}</span>
                      <span className="text-xs text-blue-500">💬 {post.comments}</span>
                      <span className="text-xs text-green-500">📤 {post.shares}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Additional Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {displayNumber(stats?.totalLikes, '0')}
            </div>
            <div className="text-sm text-gray-600">Tổng lượt thích</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {displayNumber(stats?.totalComments, '0')}
            </div>
            <div className="text-sm text-gray-600">Tổng bình luận</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {displayNumber(stats?.totalShares, '0')}
            </div>
            <div className="text-sm text-gray-600">Tổng chia sẻ</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats ? stats.avgEngagementRate.toFixed(1) : '0.0'}%
            </div>
            <div className="text-sm text-gray-600">Tỷ lệ tương tác TB</div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default EngagementAnalytics
