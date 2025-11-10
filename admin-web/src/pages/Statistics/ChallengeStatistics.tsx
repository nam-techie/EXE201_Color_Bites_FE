import { TrophyOutlined } from '@ant-design/icons'
import { Card, Col, Row, Statistic } from 'antd'
import React, { useEffect, useState } from 'react'
import LoadingState from '../../components/common/LoadingState'
import { statisticsApi } from '../../services/statisticsApi'
import type { ChallengeStatistics } from '../../types/statistics'
import { formatNumber } from '../../utils/formatters'

const ChallengeStatistics: React.FC = () => {
  const [statistics, setStatistics] = useState<ChallengeStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch challenge statistics
  const fetchStatistics = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await statisticsApi.getChallengeStatistics()
      setStatistics(response)
    } catch (error) {
      console.error('Error fetching challenge statistics:', error)
      setError(error instanceof Error ? error.message : 'Không thể tải thống kê thử thách')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatistics()
  }, [])

  if (loading) {
    return <LoadingState loading={true} />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">❌ {error}</div>
        <button 
          onClick={fetchStatistics}
          className="btn-primary"
        >
          Thử lại
        </button>
      </div>
    )
  }

  if (!statistics) {
    return <div>Không có dữ liệu thống kê</div>
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <TrophyOutlined className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thống kê thử thách</h1>
          <p className="text-gray-600">Phân tích hiệu suất và tương tác của các thử thách</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng thử thách"
              value={statistics.totalChallenges}
              prefix="🏆"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Thử thách hoạt động"
              value={statistics.activeChallenges}
              prefix="⚡"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Thử thách hoàn thành"
              value={statistics.completedChallenges}
              prefix=""
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tỷ lệ tham gia"
              value={statistics.challengeParticipationRate}
              suffix="%"
              prefix="📊"
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Performance Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Thời gian hoàn thành trung bình">
            <div className="text-center py-8">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {statistics.averageCompletionTime}h
              </div>
              <div className="text-gray-600">
                Thời gian trung bình để hoàn thành một thử thách
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Thử thách phổ biến nhất">
            <div className="space-y-3">
              {statistics.mostPopularChallenges.slice(0, 5).map((challenge, index) => (
                <div key={challenge.challengeId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm font-bold text-primary-600">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{challenge.challengeName}</div>
                      <div className="text-sm text-gray-600">{formatNumber(challenge.participants)} người tham gia</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary-600">
                      {formatNumber(challenge.participants)}
                    </div>
                    <div className="text-xs text-gray-500">người tham gia</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* System Health */}
      <Card title="Trạng thái hệ thống">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {statistics.systemStatus}
              </div>
              <div className="text-gray-600">Trạng thái hệ thống</div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {statistics.activeSessions}
              </div>
              <div className="text-gray-600">Phiên hoạt động</div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {new Date(statistics.lastUpdated).toLocaleDateString('vi-VN')}
              </div>
              <div className="text-gray-600">Cập nhật lần cuối</div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default ChallengeStatistics


