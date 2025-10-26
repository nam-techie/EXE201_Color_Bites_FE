import { Card, Col, Row } from 'antd'
import { CreditCard, DollarSign, TrendingUp } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import BarChart from '../../components/charts/BarChart'
import LineChart from '../../components/charts/LineChart'
import LoadingState from '../../components/common/LoadingState'
import StatCard from '../../components/common/StatCard'
import { statisticsApi } from '../../services/statisticsApi'
import { displayCurrency, displayNumber, formatCurrency, formatNumber } from '../../utils/formatters'

interface RevenueStats {
  totalRevenue: number
  monthlyRevenue: number
  totalTransactions: number
  successfulTransactions: number
  failedTransactions: number
  pendingTransactions: number
}

const RevenueReports: React.FC = () => {
  const [stats, setStats] = useState<RevenueStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch revenue statistics
  useEffect(() => {
    const fetchRevenueStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await statisticsApi.getRevenueStatistics()
        setStats(response)
      } catch (err) {
        console.error('Error fetching revenue statistics:', err)
        setError(err instanceof Error ? err.message : 'Không thể tải thống kê doanh thu')
      } finally {
        setLoading(false)
      }
    }

    fetchRevenueStats()
  }, [])

  // Mock data for charts
  const revenueData = [
    { month: 'T1', revenue: 10000000, transactions: 50 },
    { month: 'T2', revenue: 15000000, transactions: 75 },
    { month: 'T3', revenue: 20000000, transactions: 100 },
    { month: 'T4', revenue: 25000000, transactions: 125 },
    { month: 'T5', revenue: 30000000, transactions: 150 },
    { month: 'T6', revenue: 35000000, transactions: 175 }
  ]

  const transactionStatusData = [
    { status: 'Thành công', count: stats?.successfulTransactions || 0, color: '#52c41a' },
    { status: 'Thất bại', count: stats?.failedTransactions || 0, color: '#ff4d4f' },
    { status: 'Chờ xử lý', count: stats?.pendingTransactions || 0, color: '#faad14' }
  ]

  const dailyRevenueData = [
    { day: 'T2', revenue: 500000, transactions: 25 },
    { day: 'T3', revenue: 750000, transactions: 30 },
    { day: 'T4', revenue: 1000000, transactions: 35 },
    { day: 'T5', revenue: 1250000, transactions: 40 },
    { day: 'T6', revenue: 1500000, transactions: 45 },
    { day: 'T7', revenue: 1750000, transactions: 50 },
    { day: 'CN', revenue: 2000000, transactions: 55 }
  ]

  const statCards = stats ? [
    {
      title: 'Tổng doanh thu',
      value: displayCurrency(stats.totalRevenue, '0'),
      icon: <DollarSign className="w-6 h-6" />,
      color: '#52c41a',
      change: {
        value: 0,
        type: 'increase' as const,
        label: 'Tổng doanh thu'
      }
    },
    {
      title: 'Doanh thu tháng này',
      value: displayCurrency(stats.monthlyRevenue, '0'),
      icon: <TrendingUp className="w-6 h-6" />,
      color: '#1890ff',
      change: {
        value: 0,
        type: 'increase' as const,
        label: 'Tháng hiện tại'
      }
    },
    {
      title: 'Tổng giao dịch',
      value: displayNumber(stats.totalTransactions, '0'),
      icon: <CreditCard className="w-6 h-6" />,
      color: '#faad14',
      change: {
        value: Math.round((stats.successfulTransactions / stats.totalTransactions) * 100),
        type: 'increase' as const,
        label: `${stats.successfulTransactions} thành công`
      }
    },
    {
      title: 'Tỷ lệ thành công',
      value: `${Math.round((stats.successfulTransactions / stats.totalTransactions) * 100)}%`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: '#722ed1',
      change: {
        value: Math.round((stats.successfulTransactions / stats.totalTransactions) * 100),
        type: 'increase' as const,
        label: 'Giao dịch thành công'
      }
    }
  ] : []

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <DollarSign className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo doanh thu</h1>
          <p className="text-gray-600">Thống kê chi tiết về doanh thu và giao dịch</p>
        </div>
      </div>

      {/* Stats Cards */}
      <LoadingState
        loading={loading}
        error={error}
        empty={!loading && !stats}
        emptyText="Không có dữ liệu thống kê doanh thu"
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
          <Card title="Doanh thu theo tháng" className="h-full">
            <LineChart
              data={revenueData}
              dataKey="revenue"
              xAxisKey="month"
              lines={[
                { dataKey: 'revenue', name: 'Doanh thu (VND)', color: '#52c41a' },
                { dataKey: 'transactions', name: 'Số giao dịch', color: '#1890ff' }
              ]}
              height={300}
              tooltipFormatter={(value, name) => [
                name === 'Doanh thu (VND)' ? formatCurrency(Number(value)) : formatNumber(Number(value)), 
                name
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Trạng thái giao dịch" className="h-full">
            <div className="space-y-4">
              {transactionStatusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.status}</span>
                  </div>
                  <span className="font-medium">{formatNumber(item.count)}</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Doanh thu theo ngày trong tuần" className="h-full">
            <BarChart
              data={dailyRevenueData}
              xAxisKey="day"
              bars={[
                { dataKey: 'revenue', name: 'Doanh thu (VND)', color: '#52c41a' },
                { dataKey: 'transactions', name: 'Số giao dịch', color: '#1890ff' }
              ]}
              height={250}
              tooltipFormatter={(value, name) => [
                name === 'Doanh thu (VND)' ? formatCurrency(Number(value)) : formatNumber(Number(value)), 
                name
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Thống kê tài chính" className="h-full">
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {displayCurrency(stats?.totalRevenue, '0 VND')}
                </div>
                <div className="text-sm text-gray-600">Tổng doanh thu</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {displayCurrency(stats?.monthlyRevenue, '0 VND')}
                </div>
                <div className="text-sm text-gray-600">Doanh thu tháng này</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {stats ? Math.round((stats.successfulTransactions / stats.totalTransactions) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">Tỷ lệ giao dịch thành công</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Additional Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {displayCurrency(stats?.totalRevenue, '0 VND')}
            </div>
            <div className="text-sm text-gray-600">Tổng doanh thu</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {displayNumber(stats?.totalTransactions, '0')}
            </div>
            <div className="text-sm text-gray-600">Tổng giao dịch</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {displayNumber(stats?.successfulTransactions, '0')}
            </div>
            <div className="text-sm text-gray-600">Giao dịch thành công</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {displayNumber(stats?.failedTransactions, '0')}
            </div>
            <div className="text-sm text-gray-600">Giao dịch thất bại</div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default RevenueReports
