import React from 'react'
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface BarChartProps {
  data: any[]
  xAxisKey: string
  bars: Array<{
    dataKey: string
    name: string
    color: string
    fillOpacity?: number
  }>
  height?: number
  showLegend?: boolean
  showGrid?: boolean
  tooltipFormatter?: (value: any, name: string) => [string, string]
  barSize?: number
  layout?: 'horizontal' | 'vertical'
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  xAxisKey,
  bars,
  height = 300,
  showLegend = true,
  showGrid = true,
  tooltipFormatter,
  barSize = 40,
  layout = 'vertical'
}) => {
  return (
    <div style={{ width: '100%', height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          layout={layout}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
          <XAxis 
            dataKey={xAxisKey} 
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
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
            />
          )}
          {bars.map((bar, index) => (
            <Bar
              key={index}
              dataKey={bar.dataKey}
              name={bar.name}
              fill={bar.color}
              fillOpacity={bar.fillOpacity || 0.8}
              radius={[4, 4, 0, 0]}
              maxBarSize={barSize}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BarChart
