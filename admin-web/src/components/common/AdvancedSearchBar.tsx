import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons'
import { Button, Input, Select, DatePicker, Space, Card, Collapse } from 'antd'
import React, { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { useDebounce } from '../../utils/debounce'

const { RangePicker } = DatePicker
const { Option } = Select
const { Panel } = Collapse

interface AdvancedSearchBarProps {
  onSearch: (filters: SearchFilters) => void
  onReset: () => void
  loading?: boolean
  placeholder?: string
  searchFields?: SearchField[]
  dateFields?: DateField[]
  selectFields?: SelectField[]
}

interface SearchFilters {
  search?: string
  dateRange?: [string, string]
  selectValues?: Record<string, any>
  [key: string]: any
}

interface SearchField {
  key: string
  label: string
  placeholder?: string
}

interface DateField {
  key: string
  label: string
  placeholder?: [string, string]
}

interface SelectField {
  key: string
  label: string
  options: Array<{ label: string; value: any }>
  placeholder?: string
  multiple?: boolean
}

const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({
  onSearch,
  onReset,
  loading = false,
  placeholder = 'Tìm kiếm...',
  searchFields = [],
  dateFields = [],
  selectFields = []
}) => {
  const [filters, setFilters] = useState<SearchFilters>({})
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Debounced search to prevent excessive API calls
  const debouncedSearch = useDebounce((searchValue: string) => {
    onSearch({ ...filters, search: searchValue })
  }, 300)

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }))
    debouncedSearch(value)
  }

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onSearch(newFilters)
  }

  const handleReset = () => {
    setFilters({})
    onReset()
  }

  const hasAdvancedFilters = dateFields.length > 0 || selectFields.length > 0

  return (
    <Card className="mb-4">
      <div className="space-y-4">
        {/* Basic Search */}
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder={placeholder}
              prefix={<SearchOutlined />}
              value={filters.search || ''}
              onChange={(e) => handleSearch(e.target.value)}
              size="large"
            />
          </div>
          
          {hasAdvancedFilters && (
            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowAdvanced(!showAdvanced)}
              size="large"
            >
              {showAdvanced ? 'Ẩn bộ lọc' : 'Bộ lọc nâng cao'}
            </Button>
          )}
          
          <Button
            icon={<ClearOutlined />}
            onClick={handleReset}
            size="large"
          >
            Đặt lại
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && hasAdvancedFilters && (
          <Collapse defaultActiveKey={['1']} ghost>
            <Panel header="Bộ lọc nâng cao" key="1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Date Range Filters */}
                {dateFields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <RangePicker
                      placeholder={field.placeholder}
                      value={filters[field.key] ? [
                        filters[field.key][0] ? dayjs(filters[field.key][0]) : null,
                        filters[field.key][1] ? dayjs(filters[field.key][1]) : null
                      ] : null}
                      onChange={(dates) => {
                        if (dates && dates[0] && dates[1]) {
                          handleFilterChange(field.key, [
                            dates[0].toISOString(),
                            dates[1].toISOString()
                          ])
                        } else {
                          handleFilterChange(field.key, null)
                        }
                      }}
                      className="w-full"
                    />
                  </div>
                ))}

                {/* Select Filters */}
                {selectFields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <Select
                      placeholder={field.placeholder}
                      value={filters[field.key]}
                      onChange={(value) => handleFilterChange(field.key, value)}
                      className="w-full"
                      mode={field.multiple ? 'multiple' : undefined}
                      allowClear
                    >
                      {field.options.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </div>
                ))}
              </div>
            </Panel>
          </Collapse>
        )}

        {/* Quick Filters */}
        {searchFields.length > 0 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Tìm kiếm theo:
            </label>
            <Space wrap>
              {searchFields.map((field) => (
                <Button
                  key={field.key}
                  size="small"
                  onClick={() => {
                    const value = prompt(`Nhập ${field.label.toLowerCase()}:`)
                    if (value) {
                      handleFilterChange(field.key, value)
                    }
                  }}
                >
                  {field.label}
                </Button>
              ))}
            </Space>
          </div>
        )}

        {/* Active Filters Display */}
        {Object.keys(filters).length > 0 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Bộ lọc đang áp dụng:
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null
                
                const displayValue = Array.isArray(value) 
                  ? value.join(' - ') 
                  : String(value)
                
                return (
                  <div
                    key={key}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    <span className="mr-2">{key}: {displayValue}</span>
                    <button
                      onClick={() => handleFilterChange(key, null)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default AdvancedSearchBar
