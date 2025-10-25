import { FileText, TrendingUp, Eye, Heart } from 'lucide-react'
import { Card, Col, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import LoadingState from '../../components/common/LoadingState'
import StatCard from '../../components/common/StatCard'
import BarChart from '../../components/charts/BarChart'
import LineChart from '../../components/charts/LineChart'
import { statisticsApi } from '../../services/statisticsApi'
import { formatNumber } from '../../utils/formatters'

interface PostStats {
  totalPosts: number
  activePosts: number
  deletedPosts: number
  postsThisMonth: number
  avgPostsPerUser: number
}

const PostAnalytics: React.FC = () => {
  const [stats, setStats] = useState<PostStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch post statistics
  useEffect(() => {
    const fetchPostStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await statisticsApi.getPostStatistics()
        setStats(response.data)
      } catch (err) {
        console.error('Error fetching post statistics:', err)
        setError(err instanceof Error ? err.message : 'Không thể tải thống kê bài viết')
      } finally {
        setLoading(false)
      }
    }

    fetchPostStats()
  }, [])

  // Mock data for charts
  const postGrowthData = [
    { month: 'T1', posts: 50, active: 45 },
    { month: 'T2', posts: 75, active: 70 },
    { month: 'T3', posts: 100, active: 95 },
    { month: 'T4', posts: 125, active: 120 },
    { month: 'T5', posts: 150, active: 145 },
    { month: 'T6', posts: 175, active: 170 }
  ]

  const postEngagementData = [
    { day: 'T2', posts: 25, likes: 150, comments: 30 },
    { day: 'T3', posts: 30, likes: 180, comments: 35 },
    { day: 'T4', posts: 35, likes: 210, comments: 40 },
    { day: 'T5', posts: 40, likes: 240, comments: 45 },
    { day: 'T6', posts: 45, likes: 270, comments: 50 },
    { day: 'T7', posts: 50, likes: 300, comments: 55 },
    { day: 'CN', posts: 55, likes: 330, comments: 60 }
  ]

  const postStatusData = [
    { name: 'Hoạt động', value: stats?.activePosts || 0, color: '#52c41a' },
    { name: 'Đã xóa', value: stats?.deletedPosts || 0, color: '#ff4d4f' }
  ]

  const statCards = stats ? [
    {
      title: 'Tổng bài viết',
      value: formatNumber(stats.totalPosts),
      icon: <FileText className="w-6 h-6" />,
      color: '#1890ff',
      change: {
        value: Math.round((stats.activePosts / stats.totalPosts) * 100),
        type: 'increase' as const,
        label: `${stats.activePosts} hoạt động`
      }
    },
    {
      title: 'Bài viết tháng này',
      value: formatNumber(stats.postsThisMonth),
      icon: <TrendingUp className="w-6 h-6" />,
      color: '#52c41a',
      change: {
        value: 0,
        type: 'increase' as const,
        label: 'Tháng hiện tại'
      }
    },
    {
      title: 'Trung bình/người dùng',
      value: formatNumber(stats.avgPostsPerUser),
      icon: <Eye className="w-6 h-6" />,
      color: '#faad14',
      change: {
        value: 0,
        type: 'increase' as const,
        label: 'Bài viết/người dùng'
      }
    },
    {
      title: 'Tỷ lệ hoạt động',
      value: `${Math.round((stats.activePosts / stats.totalPosts) * 100)}%`,
      icon: <Heart className="w-6 h-6" />,
      color: '#722ed1',
      change: {
        value: Math.round((stats.activePosts / stats.totalPosts) * 100),
        type: 'increase' as const,
        label: 'Bài viết hoạt động'
      }
    }
  ] : []

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <FileText className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Phân tích bài viết</h1>
          <p className="text-gray-600">Thống kê chi tiết về bài viết trong hệ thống</p>
        </div>
      </div>

      {/* Stats Cards */}
      <LoadingState
        loading={loading}
        error={error}
        empty={!loading && !stats}
        emptyText="Không có dữ liệu thống kê bài viết"
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
          <Card title="Tăng trưởng bài viết theo tháng" className="h-full">
            <LineChart
              data={postGrowthData}
              dataKey="posts"
              xAxisKey="month"
              lines={[
                { dataKey: 'posts', name: 'Tổng bài viết', color: '#1890ff' },
                { dataKey: 'active', name: 'Bài viết hoạt động', color: '#52c41a' }
              ]}
              height={300}
              tooltipFormatter={(value, name) => [formatNumber(Number(value)), name]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Trạng thái bài viết" className="h-full">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {stats ? Math.round((stats.activePosts / stats.totalPosts) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">Tỷ lệ bài viết hoạt động</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 mb-2">
                  {stats ? Math.round((stats.deletedPosts / stats.totalPosts) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">Tỷ lệ bài viết đã xóa</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Tương tác bài viết theo ngày" className="h-full">
            <BarChart
              data={postEngagementData}
              xAxisKey="day"
              bars={[
                { dataKey: 'posts', name: 'Bài viết', color: '#1890ff' },
                { dataKey: 'likes', name: 'Lượt thích', color: '#52c41a' },
                { dataKey: 'comments', name: 'Bình luận', color: '#faad14' }
              ]}
              height={250}
              tooltipFormatter={(value, name) => [formatNumber(Number(value)), name]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Thống kê tương tác" className="h-full">
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatNumber(1500)}
                </div>
                <div className="text-sm text-gray-600">Tổng lượt thích</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatNumber(300)}
                </div>
                <div className="text-sm text-gray-600">Tổng bình luận</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {formatNumber(5.2)}
                </div>
                <div className="text-sm text-gray-600">Lượt tương tác trung bình/bài viết</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Additional Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats ? formatNumber(stats.totalPosts) : '0'}
            </div>
            <div className="text-sm text-gray-600">Tổng bài viết</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats ? formatNumber(stats.activePosts) : '0'}
            </div>
            <div className="text-sm text-gray-600">Bài viết hoạt động</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {stats ? formatNumber(stats.deletedPosts) : '0'}
            </div>
            <div className="text-sm text-gray-600">Bài viết đã xóa</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats ? formatNumber(stats.avgPostsPerUser) : '0'}
            </div>
            <div className="text-sm text-gray-600">Trung bình/người dùng</div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default PostAnalytics
