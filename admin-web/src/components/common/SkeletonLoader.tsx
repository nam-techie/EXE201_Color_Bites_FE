import React from 'react'

interface SkeletonLoaderProps {
  rows?: number
  columns?: number
  height?: string
  className?: string
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  rows = 5,
  columns = 1,
  height = '20px',
  className = ''
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 mb-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="flex-1 bg-gray-200 rounded"
              style={{ height }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// Specific skeleton components
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-3">
    {/* Header skeleton */}
    <div className="flex space-x-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex-1 h-8 bg-gray-200 rounded" />
      ))}
    </div>
    
    {/* Rows skeleton */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: 6 }).map((_, colIndex) => (
          <div key={colIndex} className="flex-1 h-6 bg-gray-100 rounded" />
        ))}
      </div>
    ))}
  </div>
)

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-lg" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
          </div>
        </div>
      </div>
    ))}
  </div>
)

export const ChartSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-400">Đang tải biểu đồ...</div>
    </div>
  </div>
)

export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
        <div className="w-16 h-6 bg-gray-200 rounded" />
      </div>
    ))}
  </div>
)

export default SkeletonLoader
