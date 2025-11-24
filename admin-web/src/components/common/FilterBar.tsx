import { FilterOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Card, DatePicker, Input, Select, Space } from 'antd'
import React, { useState } from 'react'

const { Search } = Input
const { RangePicker } = DatePicker
const { Option } = Select

export interface FilterOption {
  key: string
  label: string
  value: any
}

export interface FilterBarProps {
  searchPlaceholder?: string
  searchValue?: string
  onSearch?: (value: string) => void
  onSearchChange?: (value: string) => void
  filters?: Array<{
    key: string
    label: string
    options: FilterOption[]
    value?: any
    onChange?: (value: any) => void
  }>
  dateRange?: {
    value?: [any, any]
    onChange?: (dates: [any, any] | null) => void
  }
  onReset?: () => void
  onExport?: () => void
  loading?: boolean
  showSearch?: boolean
  showFilters?: boolean
  showDateRange?: boolean
  showReset?: boolean
  showExport?: boolean
  className?: string
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchPlaceholder = 'Tìm kiếm...',
  searchValue = '',
  onSearch,
  onSearchChange,
  filters = [],
  dateRange,
  onReset,
  onExport,
  loading = false,
  showSearch = true,
  showFilters = true,
  showDateRange = false,
  showReset = true,
  showExport = false,
  className = ''
}) => {
  const [searchText, setSearchText] = useState(searchValue)

  const handleSearch = (value: string) => {
    setSearchText(value)
    onSearch?.(value)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchText(value)
    onSearchChange?.(value)
  }

  const handleReset = () => {
    setSearchText('')
    onReset?.()
  }

  return (
    <Card className={`filter-bar ${className}`} size="small">
      <Space wrap size="middle">
        {/* Search Input */}
        {showSearch && (
          <Search
            placeholder={searchPlaceholder}
            value={searchText}
            onSearch={handleSearch}
            onChange={handleSearchChange}
            style={{ width: 300 }}
            loading={loading}
            enterButton={<SearchOutlined />}
          />
        )}

        {/* Filters */}
        {showFilters && filters.map(filter => (
          <Select
            key={filter.key}
            placeholder={filter.label}
            value={filter.value}
            onChange={filter.onChange}
            style={{ minWidth: 120 }}
            allowClear
          >
            {filter.options.map(option => (
              <Option key={option.key} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        ))}

        {/* Date Range */}
        {showDateRange && (
          <RangePicker
            value={dateRange?.value}
            onChange={dateRange?.onChange}
            placeholder={['Từ ngày', 'Đến ngày']}
            format="DD/MM/YYYY"
          />
        )}

        {/* Action Buttons */}
        <Space>
          {showReset && (
            <Button
              icon={<ReloadOutlined />}
              onClick={handleReset}
              loading={loading}
            >
              Làm mới
            </Button>
          )}

          {showExport && onExport && (
            <Button
              icon={<FilterOutlined />}
              onClick={onExport}
              loading={loading}
            >
              Xuất Excel
            </Button>
          )}
        </Space>
      </Space>
    </Card>
  )
}

export default FilterBar
