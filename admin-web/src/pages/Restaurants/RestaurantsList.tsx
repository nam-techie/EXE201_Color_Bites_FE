import {
    DeleteOutlined,
    EnvironmentOutlined,
    EyeOutlined,
    ShopOutlined,
    StarOutlined,
    UndoOutlined
} from '@ant-design/icons'
import { Card, Drawer, message } from 'antd'
import React, { useState } from 'react'
import ConfirmModal from '../../components/common/ConfirmModal'
import DataTable, { DataTableAction, DataTableColumn } from '../../components/common/DataTable'
import FilterBar from '../../components/common/FilterBar'
import LoadingState from '../../components/common/LoadingState'
import { useConfirm } from '../../hooks/useConfirm'
import { useDataTable } from '../../hooks/useDataTable'
import { restaurantsApi } from '../../services/restaurantsApi'
import type { RestaurantResponse } from '../../types/restaurant'
import { RESTAURANT_REGIONS, RESTAURANT_TYPES } from '../../types/restaurant'
import { displayCurrency, displayNumber, displayValue, formatDate, truncateText } from '../../utils/formatters'
import RestaurantDetail from './RestaurantDetail'

const RestaurantsList: React.FC = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantResponse | null>(null)
  const [detailVisible, setDetailVisible] = useState(false)
  const { confirm, modalProps } = useConfirm()

  // Data table hook
  const {
    data: restaurants,
    loading,
    isRefreshing,
    error,
    pagination,
    filters,
    refresh,
    setPage,
    setPageSize,
    setFilters
  } = useDataTable<RestaurantResponse>({
    fetchData: async (page, size, filters) => {
      const response = await restaurantsApi.getRestaurants(page - 1, size, filters)
      return {
        data: response.data.content,
        total: response.data.totalElements,
        page: response.data.number + 1,
        size: response.data.size
      }
    },
    initialFilters: {
      search: '',
      status: 'all'
    }
  })

  // Table columns
  const columns: DataTableColumn<RestaurantResponse>[] = [
    {
      key: 'name',
      title: 'Tên nhà hàng',
      dataIndex: 'name',
      render: (name: string, record) => (
        <div style={{ maxWidth: 200 }}>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>
            {displayValue(name)}
            {record.featured && (
              <StarOutlined style={{ color: '#faad14', marginLeft: 8 }} />
            )}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <EnvironmentOutlined /> {displayValue(truncateText(record.address, 50))}
          </div>
        </div>
      )
    },
    {
      key: 'type',
      title: 'Loại',
      render: (_, record) => (
        <span style={{ 
          padding: '2px 8px', 
          borderRadius: '12px', 
          backgroundColor: '#f0f0f0',
          fontSize: '12px'
        }}>
          {displayValue(record.type, 'Chưa phân loại')}
        </span>
      )
    },
    {
      key: 'region',
      title: 'Khu vực',
      render: (_, record) => displayValue(record.region, 'Chưa có khu vực')
    },
    {
      key: 'rating',
      title: 'Đánh giá',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            ⭐ {displayValue(record.rating?.toFixed(1), '0.0')}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {displayCurrency(record.avgPrice, '0')}/người
          </div>
        </div>
      )
    },
    {
      key: 'stats',
      title: 'Thống kê',
      render: (_, record) => (
        <div style={{ fontSize: '12px' }}>
          <div>❤️ {displayNumber(record.favoriteCount, '0')}</div>
        </div>
      )
    },
    {
      key: 'creator',
      title: 'Người tạo',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{displayValue(record.createdByName)}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {displayValue(record.creatorEmail)}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Trạng thái',
      render: (_, record) => (
        <span style={{
          padding: '2px 8px',
          borderRadius: '12px',
          backgroundColor: record.isDeleted ? '#ff4d4f' : 
                          record.featured ? '#1890ff' : '#52c41a',
          color: 'white',
          fontSize: '12px'
        }}>
          {record.isDeleted ? 'Đã xóa' : 
           record.featured ? 'Nổi bật' : 'Hoạt động'}
        </span>
      )
    },
    {
      key: 'createdAt',
      title: 'Ngày tạo',
      render: (_, record) => formatDate(record.createdAt, 'DD/MM/YYYY')
    }
  ]

  // Table actions
  const actions: DataTableAction<RestaurantResponse>[] = [
    {
      key: 'view',
      label: 'Xem',
      icon: <EyeOutlined />,
      type: 'link',
      onClick: (record) => {
        setSelectedRestaurant(record)
        setDetailVisible(true)
      }
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: <DeleteOutlined />,
      type: 'link',
      danger: true,
      visible: (record) => !record.isDeleted,
      onClick: async (record) => {
        const confirmed = await confirm({
          title: 'Xóa nhà hàng',
          content: 'Bạn có chắc chắn muốn xóa nhà hàng này?',
          type: 'warning'
        })
        
        if (confirmed) {
          try {
            await restaurantsApi.deleteRestaurant(record.id)
            message.success('Xóa nhà hàng thành công')
            refresh()
          } catch (error) {
            message.error('Không thể xóa nhà hàng')
          }
        }
      }
    },
    {
      key: 'restore',
      label: 'Khôi phục',
      icon: <UndoOutlined />,
      type: 'link',
      visible: (record) => record.isDeleted,
      onClick: async (record) => {
        const confirmed = await confirm({
          title: 'Khôi phục nhà hàng',
          content: 'Bạn có chắc chắn muốn khôi phục nhà hàng này?',
          type: 'info'
        })
        
        if (confirmed) {
          try {
            await restaurantsApi.restoreRestaurant(record.id)
            message.success('Khôi phục nhà hàng thành công')
            refresh()
          } catch (error) {
            message.error('Không thể khôi phục nhà hàng')
          }
        }
      }
    }
  ]

  // Filter options
  const filterOptions = [
    {
      key: 'status',
      label: 'Trạng thái',
      options: [
        { key: 'all', label: 'Tất cả', value: 'all' },
        { key: 'active', label: 'Hoạt động', value: 'active' },
        { key: 'deleted', label: 'Đã xóa', value: 'deleted' },
        { key: 'featured', label: 'Nổi bật', value: 'featured' }
      ],
      value: filters.status,
      onChange: (value: string) => {
        setFilters({ ...filters, status: value as any })
      }
    },
    {
      key: 'type',
      label: 'Loại',
      options: Object.entries(RESTAURANT_TYPES).map(([key, value]) => ({
        key,
        label: value,
        value
      })),
      value: filters.type,
      onChange: (value: string) => {
        setFilters({ ...filters, type: value })
      }
    },
    {
      key: 'region',
      label: 'Khu vực',
      options: Object.entries(RESTAURANT_REGIONS).map(([key, value]) => ({
        key,
        label: value,
        value
      })),
      value: filters.region,
      onChange: (value: string) => {
        setFilters({ ...filters, region: value })
      }
    }
  ]

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value })
  }

  const handleReset = () => {
    setFilters({ search: '', status: 'all', type: '', region: '' })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <ShopOutlined className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý nhà hàng</h1>
            <p className="text-gray-600">Quản lý tất cả nhà hàng trong hệ thống</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Tìm kiếm theo tên, địa chỉ..."
        searchValue={filters.search}
        onSearch={handleSearch}
        filters={filterOptions}
        onReset={handleReset}
        showExport={true}
        onExport={() => {
          message.info('Tính năng xuất Excel sẽ được triển khai')
        }}
      />

      {/* Data Table */}
      <Card>
        <LoadingState
          loading={loading}
          isRefreshing={isRefreshing}
          error={error}
          empty={!loading && restaurants.length === 0}
          emptyText="Không có nhà hàng nào"
          emptyDescription="Chưa có nhà hàng nào trong hệ thống"
        >
          <DataTable
            data={restaurants}
            columns={columns}
            actions={actions}
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: setPage,
              onShowSizeChange: (_: any, size: number) => setPageSize(size)
            }}
            rowKey="id"
            scroll={{ x: 1400 }}
          />
        </LoadingState>
      </Card>

      {/* Restaurant Detail Drawer */}
      <Drawer
        title="Chi tiết nhà hàng"
        placement="right"
        width={700}
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        destroyOnClose
      >
        {selectedRestaurant && (
          <RestaurantDetail 
            restaurant={selectedRestaurant} 
            onClose={() => setDetailVisible(false)}
            onUpdate={refresh}
          />
        )}
      </Drawer>

      {/* Confirm Modal */}
      <ConfirmModal {...modalProps} />
    </div>
  )
}

export default RestaurantsList
