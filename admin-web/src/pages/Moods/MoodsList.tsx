import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SmileOutlined
} from '@ant-design/icons'
import { Button, Card, message } from 'antd'
import React, { useState } from 'react'
import ConfirmModal from '../../components/common/ConfirmModal'
import DataTable, { DataTableAction, DataTableColumn } from '../../components/common/DataTable'
import FilterBar from '../../components/common/FilterBar'
import LoadingState from '../../components/common/LoadingState'
import { useConfirm } from '../../hooks/useConfirm'
import { useDataTable } from '../../hooks/useDataTable'
import { moodsApi } from '../../services/moodsApi'
import type { Mood } from '../../types/mood'
import { formatDate, formatNumber } from '../../utils/formatters'
import MoodForm from './MoodForm'

const MoodsList: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [formVisible, setFormVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { confirm, modalProps } = useConfirm()

  // Data table hook
  const {
    data: moods,
    loading,
    error,
    pagination,
    filters,
    refresh,
    setPage,
    setPageSize,
    setFilters
  } = useDataTable<Mood>({
    fetchData: async (page, size, filters) => {
      const response = await moodsApi.getMoods({
        ...filters,
        page: page - 1,
        size: size
      })
      return {
        data: response.data.content,
        total: response.data.totalElements,
        page: response.data.number + 1,
        size: response.data.size
      }
    },
    initialFilters: {
      search: '',
      sortBy: 'name',
      order: 'asc'
    }
  })

  // Table columns
  const columns: DataTableColumn<Mood>[] = [
    {
      key: 'id',
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      render: (id: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
          {id.slice(0, 8)}...
        </span>
      )
    },
    {
      key: 'name',
      title: 'Tên mood',
      dataIndex: 'name',
      render: (name: string) => (
        <div className="flex items-center space-x-2">
          <SmileOutlined className="w-4 h-4 text-yellow-500" />
          <span className="font-medium">{name}</span>
        </div>
      )
    },
    {
      key: 'description',
      title: 'Mô tả',
      dataIndex: 'description',
      render: (description: string) => (
        <span className="text-gray-600 text-sm">
          {description || 'Không có mô tả'}
        </span>
      )
    },
    {
      key: 'usageCount',
      title: 'Số lần sử dụng',
      dataIndex: 'usageCount',
      render: (count: number) => (
        <span className="font-medium text-blue-600">
          {formatNumber(count)}
        </span>
      )
    },
    {
      key: 'createdAt',
      title: 'Ngày tạo',
      render: (_, record) => formatDate(record.createdAt, 'DD/MM/YYYY HH:mm')
    }
  ]

  // Table actions
  const actions: DataTableAction<Mood>[] = [
    {
      key: 'edit',
      label: 'Chỉnh sửa',
      icon: <EditOutlined />,
      type: 'link',
      onClick: (record) => {
        setSelectedMood(record)
        setIsEditing(true)
        setFormVisible(true)
      }
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: <DeleteOutlined />,
      type: 'link',
      danger: true,
      onClick: async (record) => {
        const confirmed = await confirm({
          title: 'Xóa mood',
          content: `Bạn có chắc chắn muốn xóa mood "${record.name}"?`,
          type: 'error'
        })
        
        if (confirmed) {
          try {
            await moodsApi.deleteMood(record.id)
            message.success('Xóa mood thành công')
            refresh()
          } catch (error) {
            message.error('Không thể xóa mood')
          }
        }
      }
    }
  ]

  // Filter options
  const filterOptions = [
    {
      key: 'sortBy',
      label: 'Sắp xếp theo',
      options: [
        { key: 'name', label: 'Tên', value: 'name' },
        { key: 'usageCount', label: 'Số lần sử dụng', value: 'usageCount' },
        { key: 'createdAt', label: 'Ngày tạo', value: 'createdAt' }
      ],
      value: filters.sortBy,
      onChange: (value: string) => {
        setFilters({ ...filters, sortBy: value as any })
      }
    },
    {
      key: 'order',
      label: 'Thứ tự',
      options: [
        { key: 'asc', label: 'Tăng dần', value: 'asc' },
        { key: 'desc', label: 'Giảm dần', value: 'desc' }
      ],
      value: filters.order,
      onChange: (value: string) => {
        setFilters({ ...filters, order: value as any })
      }
    }
  ]

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value })
  }

  const handleReset = () => {
    setFilters({ search: '', sortBy: 'name', order: 'asc' })
  }

  const handleCreateMood = () => {
    setSelectedMood(null)
    setIsEditing(false)
    setFormVisible(true)
  }

  const handleFormClose = () => {
    setFormVisible(false)
    setSelectedMood(null)
    setIsEditing(false)
  }

  const handleFormSubmit = () => {
    handleFormClose()
    refresh()
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <SmileOutlined className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý mood</h1>
            <p className="text-gray-600">Quản lý tất cả mood trong hệ thống</p>
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateMood}
        >
          Thêm mood mới
        </Button>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Tìm kiếm theo tên mood..."
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
          error={error}
          empty={!loading && moods.length === 0}
          emptyText="Không có mood nào"
          emptyDescription="Chưa có mood nào trong hệ thống"
        >
          <DataTable
            data={moods}
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
            scroll={{ x: 1200 }}
          />
        </LoadingState>
      </Card>

      {/* Mood Form Modal */}
      <MoodForm
        visible={formVisible}
        mood={selectedMood}
        isEditing={isEditing}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />

      {/* Confirm Modal */}
      <ConfirmModal {...modalProps} />
    </div>
  )
}

export default MoodsList
