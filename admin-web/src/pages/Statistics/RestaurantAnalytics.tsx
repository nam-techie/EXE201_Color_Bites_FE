import { Card, Col, Row } from 'antd'
import { MapPin, Star, Store, TrendingUp } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import BarChart from '../../components/charts/BarChart'
import LineChart from '../../components/charts/LineChart'
import PieChart from '../../components/charts/PieChart'
import LoadingState from '../../components/common/LoadingState'
import StatCard from '../../components/common/StatCard'
import { statisticsApi } from '../../services/statisticsApi'
import { displayNumber, formatNumber } from '../../utils/formatters'

interface RestaurantStats {
  totalRestaurants: number
  activeRestaurants: number
  deletedRestaurants: number
  avgRating: number
  restaurantsThisMonth: number
}

const RestaurantAnalytics: React.FC = () => {
  const [stats, setStats] = useState<RestaurantStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch restaurant statistics
  useEffect(() => {
    const fetchRestaurantStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await statisticsApi.getRestaurantStatistics()
        setStats(response.data as RestaurantStats)
      } catch (err) {
        console.error('Error fetching restaurant statistics:', err)
        setError(err instanceof Error ? err.message : 'Không thể tải thống kê nhà hàng')
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurantStats()
  }, [])

  // Mock data for charts
  const restaurantGrowthData = [
    { month: 'T1', restaurants: 20, active: 18 },
    { month: 'T2', restaurants: 35, active: 32 },
    { month: 'T3', restaurants: 50, active: 47 },
    { month: 'T4', restaurants: 65, active: 62 },
    { month: 'T5', restaurants: 80, active: 77 },
    { month: 'T6', restaurants: 95, active: 92 }
  ]

  const ratingDistributionData = [
    { name: '5 sao', value: 25, color: '#52c41a' },
    { name: '4 sao', value: 40, color: '#1890ff' },
    { name: '3 sao', value: 20, color: '#faad14' },
    { name: '2 sao', value: 10, color: '#ff7a45' },
    { name: '1 sao', value: 5, color: '#ff4d4f' }
  ]

  const restaurantStatusData = [
    { name: 'Hoạt động', value: stats?.activeRestaurants || 0, color: '#52c41a' },
    { name: 'Đã xóa', value: stats?.deletedRestaurants || 0, color: '#ff4d4f' }
  ]

  const regionData = [
    { region: 'TP.HCM', count: 45, avgRating: 4.2 },
    { region: 'Hà Nội', count: 30, avgRating: 4.1 },
    { region: 'Đà Nẵng', count: 15, avgRating: 4.0 },
    { region: 'Khác', count: 10, avgRating: 3.8 }
  ]

  const statCards = stats ? [
    {
      title: 'Tổng nhà hàng',
      value: displayNumber(stats.totalRestaurants, '0'),
      icon: <Store className="w-6 h-6" />,
      color: '#1890ff',
      change: {
        value: Math.round((stats.activeRestaurants / stats.totalRestaurants) * 100),
        type: 'increase' as const,
        label: `${stats.activeRestaurants} hoạt động`
      }
    },
    {
      title: 'Đánh giá trung bình',
      value: `${stats.avgRating.toFixed(1)}`,
      icon: <Star className="w-6 h-6" />,
      color: '#faad14',
      change: {
        value: 0,
        type: 'increase' as const,
        label: 'Sao trung bình'
      }
    },
    {
      title: 'Nhà hàng tháng này',
      value: displayNumber(stats.restaurantsThisMonth, '0'),
      icon: <TrendingUp className="w-6 h-6" />,
      color: '#52c41a',
      change: {
        value: 0,
        type: 'increase' as const,
        label: 'Tháng hiện tại'
      }
    },
    {
      title: 'Tỷ lệ hoạt động',
      value: `${Math.round((stats.activeRestaurants / stats.totalRestaurants) * 100)}%`,
      icon: <MapPin className="w-6 h-6" />,
      color: '#722ed1',
      change: {
        value: Math.round((stats.activeRestaurants / stats.totalRestaurants) * 100),
        type: 'increase' as const,
        label: 'Nhà hàng hoạt động'
      }
    }
  ] : []

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <Store className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Phân tích nhà hàng</h1>
          <p className="text-gray-600">Thống kê chi tiết về nhà hàng trong hệ thống</p>
        </div>
      </div>

      {/* Stats Cards */}
      <LoadingState
        loading={loading}
        error={error}
        empty={!loading && !stats}
        emptyText="Không có dữ liệu thống kê nhà hàng"
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
          <Card title="Tăng trưởng nhà hàng theo tháng" className="h-full">
            <LineChart
              data={restaurantGrowthData}
              xAxisKey="month"
              lines={[
                { dataKey: 'restaurants', name: 'Tổng nhà hàng', color: '#1890ff' },
                { dataKey: 'active', name: 'Nhà hàng hoạt động', color: '#52c41a' }
              ]}
              height={300}
              tooltipFormatter={(value, name) => [formatNumber(Number(value)), name]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Trạng thái nhà hàng" className="h-full">
            <PieChart
              data={restaurantStatusData}
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
          <Card title="Phân bố đánh giá" className="h-full">
            <PieChart
              data={ratingDistributionData}
              height={250}
              showLabel={true}
              labelFormatter={(entry) => `${entry.value}%`}
              tooltipFormatter={(value, name) => [formatNumber(Number(value)), name]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Nhà hàng theo khu vực" className="h-full">
            <BarChart
              data={regionData}
              xAxisKey="region"
              bars={[
                { dataKey: 'count', name: 'Số lượng', color: '#1890ff' },
                { dataKey: 'avgRating', name: 'Đánh giá TB', color: '#faad14' }
              ]}
              height={250}
              tooltipFormatter={(value, name) => [formatNumber(Number(value)), name]}
            />
          </Card>
        </Col>
      </Row>

      {/* Additional Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {displayNumber(stats?.totalRestaurants, '0')}
            </div>
            <div className="text-sm text-gray-600">Tổng nhà hàng</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {displayNumber(stats?.activeRestaurants, '0')}
            </div>
            <div className="text-sm text-gray-600">Nhà hàng hoạt động</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {stats ? stats.avgRating.toFixed(1) : '0.0'}
            </div>
            <div className="text-sm text-gray-600">Đánh giá trung bình</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats ? Math.round((stats.activeRestaurants / stats.totalRestaurants) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Tỷ lệ hoạt động</div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default RestaurantAnalytics
