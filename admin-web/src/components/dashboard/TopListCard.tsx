import React from 'react'
import { Card } from 'antd'

export interface TopItem {
  id: string
  name: string
  value: number
  meta?: Record<string, any>
}

interface TopListCardProps {
  title: string
  items: TopItem[]
  valueLabel?: string
  emptyText?: string
}

const TopListCard: React.FC<TopListCardProps> = ({
  title,
  items,
  valueLabel = 'Điểm',
  emptyText = 'Không có dữ liệu'
}) => {
  return (
    <Card title={title} className="h-full">
      {items.length === 0 ? (
        <div className="text-sm text-gray-500">{emptyText}</div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {items.map((it) => (
            <li key={it.id} className="py-2 flex items-center justify-between">
              <div className="truncate pr-2 text-gray-800">{it.name}</div>
              <div className="text-sm font-medium text-gray-700">
                {valueLabel}: {it.value}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

export default TopListCard


