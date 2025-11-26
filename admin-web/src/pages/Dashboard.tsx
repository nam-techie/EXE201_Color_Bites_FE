import { DatePicker, Radio } from 'antd'
import { BarChart3, CreditCard, FileText, MoreHorizontal, Plus, Store, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import PieChart from '../components/charts/PieChart'
import LoadingState from '../components/common/LoadingState'
import KpiCard from '../components/dashboard/KpiCard'
import TopListCard from '../components/dashboard/TopListCard'
import TrendCard from '../components/dashboard/TrendCard'
import { useDashboardStats } from '../hooks/useDashboardStats'
import { formatNumber } from '../utils/formatters'

const { RangePicker } = DatePicker

const Dashboard = () => {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly')
  const [dateRange, setDateRange] = useState<any>()

  const { loading, error, kpis, contentDistribution, userStatus, userPostGrowth, revenueSeries, topPosts, topRestaurants, topUsers } =
    useDashboardStats({
      period,
      dateRange: dateRange
        ? { start: dateRange[0].toISOString(), end: dateRange[1].toISOString() }
        : undefined
    })

  const kpiIcons = useMemo(
    () => ({
      users: <Users />,
      posts: <FileText />,
      restaurants: <Store />,
      transactions: <CreditCard />,
      'revenue-month': <BarChart3 />
    }),
    []
  )

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Overview</h1>
          <p className="text-gray-500">Track your system performance and growth</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm">
          <Radio.Group
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            options={[
              { label: 'Day', value: 'daily' },
              { label: 'Week', value: 'weekly' },
              { label: 'Month', value: 'monthly' },
              { label: 'Year', value: 'yearly' }
            ]}
            optionType="button"
            buttonStyle="solid"
            className="custom-radio-group"
          />
          <div className="h-6 w-px bg-gray-200 mx-1"></div>
          <RangePicker bordered={false} onChange={(val) => setDateRange(val)} />
        </div>
      </div>

      <LoadingState
        loading={loading}
        error={error}
        empty={!loading && kpis.length === 0}
        emptyText="No data available"
      >
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {kpis.map((kpi) => (
            <KpiCard
              key={kpi.key}
              title={kpi.title}
              value={formatNumber(kpi.value)}
              icon={kpiIcons[kpi.key as keyof typeof kpiIcons]}
              color={kpi.key === 'users' ? '#3b82f6' : kpi.key === 'posts' ? '#10b981' : kpi.key === 'restaurants' ? '#f59e0b' : '#8b5cf6'}
              extraLabel={kpi.extra?.label}
              extraValue={kpi.extra?.value}
            />
          ))}
        </div>
      </LoadingState>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendCard
            title="Growth Analytics"
            mode="line"
            data={userPostGrowth}
            xAxisKey="month"
            lines={[
              { dataKey: 'users', name: 'Users', color: '#3b82f6' },
              { dataKey: 'posts', name: 'Posts', color: '#10b981' }
            ]}
            height={350}
            tooltipFormatter={(value, name) => [formatNumber(Number(value)), name]}
          />
        </div>
        <div className="lg:col-span-1">
          <div className="card h-full p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900">Content Distribution</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <PieChart
                data={contentDistribution}
                height={280}
                showLabel={false}
                labelFormatter={(entry) => `${entry.value}`}
                tooltipFormatter={(value, name) => [formatNumber(Number(value)), name]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Charts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors">
                <Plus className="w-6 h-6 mb-2" />
                <span className="text-xs font-medium">New User</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                <Store className="w-6 h-6 mb-2" />
                <span className="text-xs font-medium">Add Restaurant</span>
              </button>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4">User Status</h3>
            <PieChart
              data={userStatus}
              height={200}
              showLabel={false}
              labelFormatter={(entry) => `${entry.value}`}
              tooltipFormatter={(value, name) => [formatNumber(Number(value)), name]}
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <TrendCard
            title="Revenue Overview"
            mode="bar"
            data={revenueSeries}
            xAxisKey="label"
            bars={[{ dataKey: 'revenue', name: 'Revenue', color: '#8b5cf6' }]}
            height={350}
            tooltipFormatter={(value, name) => [formatNumber(Number(value)), name]}
          />
        </div>
      </div>

      {/* Top Lists */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TopListCard title="Top Performing Posts" items={topPosts} valueLabel="Score" />
        <TopListCard title="Top Rated Restaurants" items={topRestaurants} valueLabel="Score" />
        <TopListCard title="Most Active Users" items={topUsers} valueLabel="Score" />
      </div>
    </div>
  )
}

export default Dashboard
