import {
  CreditCard,
  FileText,
  Store,
  Users
} from 'lucide-react'
import { useEffect, useState } from 'react'
import LoadingState from '../components/common/LoadingState'
import StatCard from '../components/common/StatCard'
import { statisticsApi } from '../services/statisticsApi'
import { displayNumber } from '../utils/formatters'

interface SystemStats {
  totalUsers: number
  activeUsers: number
  totalPosts: number
  totalRestaurants: number
  totalTransactions: number
  totalComments?: number
  totalTags?: number
  totalChallenges?: number
  totalRevenue?: number
  monthlyRevenue?: number
  dailyRevenue?: number
  successfulTransactions?: number
  failedTransactions?: number
  pendingTransactions?: number
  totalReactions?: number
  totalFavorites?: number
  averageRating?: number
  totalMoodMaps?: number
  totalQuizzes?: number
}

const Dashboard = () => {
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

  const statCards = stats ? [
    {
      title: 'Tổng người dùng',
      value: displayNumber(stats.totalUsers, '0'),
      icon: <Users className="w-6 h-6" />,
      color: '#1890ff',
      change: {
        value: Math.round((stats.activeUsers / stats.totalUsers) * 100),
        type: 'increase' as const,
        label: `${displayNumber(stats.activeUsers, '0')} hoạt động`
      }
    },
    {
      title: 'Tổng bài viết',
      value: displayNumber(stats.totalPosts, '0'),
      icon: <FileText className="w-6 h-6" />,
      color: '#52c41a',
      change: {
        value: Math.round((stats.totalPosts / stats.totalPosts) * 100),
        type: 'increase' as const,
        label: `${displayNumber(stats.totalPosts, '0')} tổng số`
      }
    },
    {
      title: 'Tổng nhà hàng',
      value: displayNumber(stats.totalRestaurants, '0'),
      icon: <Store className="w-6 h-6" />,
      color: '#faad14',
      change: {
        value: Math.round((stats.totalRestaurants / stats.totalRestaurants) * 100),
        type: 'increase' as const,
        label: `${displayNumber(stats.totalRestaurants, '0')} tổng số`
      }
    },
    {
      title: 'Tổng giao dịch',
      value: displayNumber(stats.totalTransactions, '0'),
      icon: <CreditCard className="w-6 h-6" />,
      color: '#722ed1',
      change: {
        value: 0,
        type: 'increase' as const,
        label: 'Tổng số giao dịch'
      }
    }
  ] : []

  const trafficData = [
    { label: 'Visits', value: '29.703 Users (40%)', color: 'bg-green-500' },
    { label: 'Unique', value: '24.093 Users (20%)', color: 'bg-blue-500' },
    { label: 'Pageviews', value: '78.706 Views (60%)', color: 'bg-yellow-500' },
    { label: 'New Users', value: '22.123 Users (80%)', color: 'bg-red-500' },
    { label: 'Bounce Rate', value: 'Average Rate (40.15%)', color: 'bg-purple-500' }
  ]

  return (
    <div className="space-y-6">
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

      {/* Traffic Chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Traffic</h2>
          <p className="text-sm text-gray-500">January - July 2023</p>
        </div>
        
        {/* Chart Placeholder */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center mb-6">
          <p className="text-gray-500">Chart visualization would go here</p>
        </div>

        {/* Traffic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {trafficData.map((item, index) => (
            <div key={index} className="text-center">
              <div className={`w-4 h-4 ${item.color} rounded-full mx-auto mb-2`}></div>
              <p className="text-sm font-medium text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-600">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="card p-6">
            <div className="h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center mb-4">
              <div className="text-white text-center">
                <div className="text-2xl font-bold mb-1">89.9%</div>
                <div className="text-sm opacity-90">Metric {item}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
