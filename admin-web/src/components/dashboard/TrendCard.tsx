import React from 'react'
import { Card } from 'antd'
import LineChart from '../charts/LineChart'
import BarChart from '../charts/BarChart'

type Mode = 'line' | 'bar'

interface TrendCardProps {
  title: string
  mode: Mode
  data: any[]
  xAxisKey: string
  lines?: Array<{ dataKey: string; name: string; color: string }>
  bars?: Array<{ dataKey: string; name: string; color: string }>
  height?: number
  tooltipFormatter?: (value: any, name: string) => [string, string]
}

const TrendCard: React.FC<TrendCardProps> = ({
  title,
  mode,
  data,
  xAxisKey,
  lines = [],
  bars = [],
  height = 300,
  tooltipFormatter
}) => {
  return (
    <Card title={title} className="h-full">
      {mode === 'line' ? (
        <LineChart
          data={data}
          xAxisKey={xAxisKey}
          lines={lines}
          height={height}
          tooltipFormatter={tooltipFormatter}
        />
      ) : (
        <BarChart
          data={data}
          xAxisKey={xAxisKey}
          bars={bars}
          height={height}
          tooltipFormatter={tooltipFormatter}
          layout="horizontal"
        />
      )}
    </Card>
  )
}

export default TrendCard


