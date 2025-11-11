import React from 'react'
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts'

interface PieChartProps {
  data: Array<{
    name: string
    value: number
    color: string
  }>
  height?: number
  showLegend?: boolean
  showLabel?: boolean
  labelFormatter?: (entry: any) => string
  tooltipFormatter?: (value: any, name: string) => [string, string]
  innerRadius?: number
  outerRadius?: number
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  height = 300,
  showLegend = true,
  showLabel = false,
  labelFormatter,
  tooltipFormatter,
  innerRadius = 0,
  outerRadius = 80
}) => {
  const renderCustomizedLabel = (entry: any) => {
    if (!showLabel) return null
    
    const RADIAN = Math.PI / 180
    const radius = entry.innerRadius + (entry.outerRadius - entry.innerRadius) * 0.5
    const x = entry.cx + radius * Math.cos(-entry.midAngle * RADIAN)
    const y = entry.cy + radius * Math.sin(-entry.midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > entry.cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {labelFormatter ? labelFormatter(entry) : `${entry.value}`}
      </text>
    )
  }

  return (
    <div style={{ width: '100%', height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            formatter={tooltipFormatter}
          />
          {showLegend && (
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PieChart
