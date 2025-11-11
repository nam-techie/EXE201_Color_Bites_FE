import { BarChart3, CreditCard, FileText, Store, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { DatePicker, Radio, Row, Col } from 'antd'
import LoadingState from '../components/common/LoadingState'
import KpiCard from '../components/dashboard/KpiCard'
import TrendCard from '../components/dashboard/TrendCard'
import PieChart from '../components/charts/PieChart'
import TopListCard from '../components/dashboard/TopListCard'
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
      users: <Users className="w-6 h-6" />,
      posts: <FileText className="w-6 h-6" />,
      restaurants: <Store className="w-6 h-6" />,
      transactions: <CreditCard className="w-6 h-6" />,
      'revenue-month': <BarChart3 className="w-6 h-6" />
    }),
    []
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Tổng quan hoạt động hệ thống</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
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
          />
          <RangePicker onChange={(val) => setDateRange(val)} />
        </div>
      </div>

      <LoadingState
        loading={loading}
        error={error}
        empty={!loading && kpis.length === 0}
        emptyText="Không có dữ liệu thống kê"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {kpis.map((kpi) => (
            <KpiCard
              key={kpi.key}
              title={kpi.title}
              value={formatNumber(kpi.value)}
              icon={kpiIcons[kpi.key as keyof typeof kpiIcons]}
              color={kpi.key === 'users' ? '#1890ff' : kpi.key === 'posts' ? '#52c41a' : kpi.key === 'restaurants' ? '#faad14' : '#722ed1'}
              extraLabel={kpi.extra?.label}
              extraValue={kpi.extra?.value}
            />
          ))}
        </div>
      </LoadingState>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <TrendCard
            title="Tăng trưởng người dùng và bài viết"
            mode="line"
            data={userPostGrowth}
            xAxisKey="month"
            lines={[
              { dataKey: 'users', name: 'Người dùng', color: '#1890ff' },
              { dataKey: 'posts', name: 'Bài viết', color: '#52c41a' }
            ]}
            height={300}
            tooltipFormatter={(value, name) => [formatNumber(Number(value)), name]}
          />
        </Col>
        <Col xs={24} lg={8}>
          <div className="h-full card">
            <PieChart
              data={contentDistribution}
              height={340}
              showLabel={true}
              labelFormatter={(entry) => `${entry.value}`}
              tooltipFormatter={(value, name) => [formatNumber(Number(value)), name]}
            />
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <div className="card">
            <PieChart
              data={userStatus}
              height={300}
              showLabel={true}
              labelFormatter={(entry) => `${entry.value}`}
              tooltipFormatter={(value, name) => [formatNumber(Number(value)), name]}
            />
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <TrendCard
            title="Doanh thu theo kỳ"
            mode="bar"
            data={revenueSeries}
            xAxisKey="label"
            bars={[{ dataKey: 'revenue', name: 'Doanh thu', color: '#722ed1' }]}
            height={300}
            tooltipFormatter={(value, name) => [formatNumber(Number(value)), name]}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <TopListCard title="Top bài viết" items={topPosts} valueLabel="Điểm" />
        </Col>
        <Col xs={24} md={8}>
          <TopListCard title="Top nhà hàng" items={topRestaurants} valueLabel="Điểm" />
        </Col>
        <Col xs={24} md={8}>
          <TopListCard title="Top người dùng" items={topUsers} valueLabel="Điểm" />
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
