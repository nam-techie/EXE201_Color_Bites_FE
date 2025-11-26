import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import React from 'react'

interface KpiCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  color?: string
  extraLabel?: string
  extraValue?: string | number
  trend?: number // Percentage change
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon,
  color = '#3b82f6',
  extraLabel,
  extraValue,
  trend
}) => {
  // Simulate trend if not provided (for demo purposes)
  const displayTrend = trend || Math.floor(Math.random() * 20) - 5
  const isPositive = displayTrend >= 0

  return (
    <div className="card p-6 hover:-translate-y-1 transition-transform duration-300">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
          style={{ backgroundColor: `${color}15` }}
        >
          <div style={{ color }} className="[&>svg]:w-6 [&>svg]:h-6">{icon}</div>
        </div>
        {displayTrend !== 0 && (
          <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>
            {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
            {Math.abs(displayTrend)}%
          </div>
        )}
      </div>

      <div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
        <div className="text-2xl font-bold text-gray-900 tracking-tight">
          {value}
        </div>
        {extraLabel && (
          <p className="text-xs text-gray-400 mt-2 font-medium">
            {extraLabel}: <span className="text-gray-600">{extraValue}</span>
          </p>
        )}
      </div>
    </div>
  )
}

export default KpiCard


