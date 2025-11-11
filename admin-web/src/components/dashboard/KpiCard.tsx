import React from 'react'
import { Card } from 'antd'

interface KpiCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  color?: string
  extraLabel?: string
  extraValue?: string | number
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon,
  color = '#1890ff',
  extraLabel,
  extraValue
}) => {
  return (
    <Card className="h-full">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-2xl font-semibold text-gray-900 mt-1">
            {value}
          </div>
          {extraLabel !== undefined && (
            <div className="text-xs text-gray-500 mt-1">
              {extraLabel}: <span className="font-medium text-gray-700">{extraValue}</span>
            </div>
          )}
        </div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}1a` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
    </Card>
  )
}

export default KpiCard


