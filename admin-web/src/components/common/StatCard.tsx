import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { Card, Statistic } from 'antd'
import React from 'react'

export interface StatCardProps {
  title: string
  value: number | string
  icon?: React.ReactNode
  color?: string
  change?: {
    value: number
    type: 'increase' | 'decrease'
    label?: string
  }
  loading?: boolean
  className?: string
  onClick?: () => void
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = '#1890ff',
  change,
  loading = false,
  className = '',
  onClick
}) => {
  const cardStyle = onClick ? { cursor: 'pointer' } : {}
  
  const statisticProps = {
    title,
    value,
    loading,
    prefix: icon,
    valueStyle: { color },
    ...(change && {
      suffix: (
        <span style={{ 
          color: change.type === 'increase' ? '#52c41a' : '#ff4d4f',
          fontSize: '12px'
        }}>
          {change.type === 'increase' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          {Math.abs(change.value)}%
        </span>
      )
    })
  }

  return (
    <Card
      className={`stat-card ${className}`}
      style={cardStyle}
      onClick={onClick}
      hoverable={!!onClick}
    >
      <Statistic {...statisticProps} />
      {change?.label && (
        <div style={{ 
          marginTop: '8px', 
          fontSize: '12px', 
          color: '#666' 
        }}>
          {change.label}
        </div>
      )}
    </Card>
  )
}

export default StatCard
