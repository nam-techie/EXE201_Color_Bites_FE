import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  TagOutlined,
  UndoOutlined
} from '@ant-design/icons'
import { Button, Card, message } from 'antd'
import { Download } from 'lucide-react'
import React, { useState } from 'react'
import ConfirmModal from '../../components/common/ConfirmModal'
import DataTable, { DataTableAction, DataTableColumn } from '../../components/common/DataTable'
import FilterBar from '../../components/common/FilterBar'
import LoadingState from '../../components/common/LoadingState'
import { useConfirm } from '../../hooks/useConfirm'
import { useDataTable } from '../../hooks/useDataTable'
import { tagsApi } from '../../services/tagsApi'
import type { Tag } from '../../types/tag'
import { exportTagsToExcel } from '../../utils/export'
import { displayNumber, displayValue, formatDate } from '../../utils/formatters'
import TagForm from './TagForm'

const TagsList: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)
  const [formVisible, setFormVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const { confirm, modalProps } = useConfirm()

  // Data table hook
  const {
    data: tags,
    loading,
    error,
    pagination,
    filters,
    refresh,
    setPage,
    setPageSize,
    setFilters
  } = useDataTable<Tag>({
    fetchData: async (page, size, filters) => {
      const response = await tagsApi.getTags({
        ...filters,
        page: page - 1,
        limit: size
      })
      return {
        data: response.data,
        total: response.total,
        page: response.page + 1,
        size: response.limit
      }
    },
    initialFilters: {
      search: '',
      isDeleted: undefined,
      sortBy: 'name',
      order: 'asc'
    }
  })

  // Table columns
  const columns: DataTableColumn<Tag>[] = [
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
      title: 'Tên tag',
      dataIndex: 'name',
      render: (name: string, record: Tag) => (
        <div className="flex items-center space-x-2">
          <span className="font-medium">{displayValue(name)}</span>
          {record.isDeleted && (
            <span style={{
              padding: '2px 6px',
              borderRadius: '8px',
              backgroundColor: '#ff4d4f',
              color: 'white',
              fontSize: '10px',
              fontWeight: 500
            }}>
              Đã xóa
            </span>
          )}
        </div>
      )
    },
    {
      key: 'description',
      title: 'Mô tả',
      dataIndex: 'description',
      render: (description: string) => (
        <span className="text-gray-600 text-sm">
          {displayValue(description, 'Không có mô tả')}
        </span>
      )
    },
    {
      key: 'usageCount',
      title: 'Số lần sử dụng',
      dataIndex: 'usageCount',
      render: (count: number) => (
        <span className="font-medium text-blue-600">
          {displayNumber(count, '0')}
        </span>
      )
    },
    {
      key: 'stats',
      title: 'Thống kê',
      render: (_, record) => (
        <div style={{ fontSize: '12px' }}>
          <div>{displayNumber(record.postCount, '0')} bài viết</div>
          <div>{displayNumber(record.restaurantCount, '0')} nhà hàng</div>
        </div>
      )
    },
    {
      key: 'createdAt',
      title: 'Ngày tạo',
      render: (_, record) => formatDate(record.createdAt, 'DD/MM/YYYY HH:mm')
    }
  ]

  // Table actions
  const actions: DataTableAction<Tag>[] = [
    {
      key: 'edit',
      label: 'Chỉnh sửa',
      icon: <EditOutlined />,
      type: 'link',
      visible: (record) => !record.isDeleted,
      onClick: (record) => {
        setSelectedTag(record)
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
      visible: (record) => !record.isDeleted,
      onClick: async (record) => {
        const confirmed = await confirm({
          title: 'Xóa tag',
          content: `Bạn có chắc chắn muốn xóa tag "${record.name}"?`,
          type: 'error'
        })
        
        if (confirmed) {
          try {
            await tagsApi.deleteTag(record.id)
            message.success('Xóa tag thành công')
            refresh()
          } catch (error) {
            message.error('Không thể xóa tag')
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
          title: 'Khôi phục tag',
          content: `Bạn có chắc chắn muốn khôi phục tag "${record.name}"?`,
          type: 'info'
        })
        
        if (confirmed) {
          try {
            await tagsApi.restoreTag(record.id)
            message.success('Khôi phục tag thành công')
            refresh()
          } catch (error) {
            message.error('Không thể khôi phục tag')
          }
        }
      }
    }
  ]

  // Filter options
  const filterOptions = [
    {
      key: 'isDeleted',
      label: 'Trạng thái',
      options: [
        { key: 'all', label: 'Tất cả', value: undefined },
        { key: 'active', label: 'Hoạt động', value: false },
        { key: 'deleted', label: 'Đã xóa', value: true }
      ],
      value: filters.isDeleted,
      onChange: (value: boolean | undefined) => {
        setFilters({ ...filters, isDeleted: value })
      }
    },
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
    setFilters({ search: '', isDeleted: undefined, sortBy: 'name', order: 'asc' })
  }

  const handleCreateTag = () => {
    setSelectedTag(null)
    setIsEditing(false)
    setFormVisible(true)
  }

  const handleFormClose = () => {
    setFormVisible(false)
    setSelectedTag(null)
    setIsEditing(false)
  }

  const handleFormSubmit = () => {
    handleFormClose()
    refresh()
  }

  const handleExport = async () => {
    setExportLoading(true)
    try {
      const response = await tagsApi.getTags({ page: 0, limit: 10000 })
      await exportTagsToExcel(response.data)
      message.success(`Đã xuất ${response.data.length} tag ra file Excel`)
    } catch (error) {
      console.error('Error exporting tags:', error)
      message.error('Có lỗi xảy ra khi xuất file Excel')
    } finally {
      setExportLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <TagOutlined className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý tag</h1>
            <p className="text-gray-600">Quản lý tất cả tag trong hệ thống</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleExport}
            disabled={exportLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{exportLoading ? 'Đang xuất...' : 'Xuất Excel'}</span>
          </button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateTag}
          >
            Thêm tag mới
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Tìm kiếm theo tên tag..."
        searchValue={filters.search}
        onSearch={handleSearch}
        filters={filterOptions}
        onReset={handleReset}
        showExport={false}
      />

      {/* Data Table */}
      <Card>
        <LoadingState
          loading={loading}
          error={error}
          empty={!loading && tags.length === 0}
          emptyText="Không có tag nào"
          emptyDescription="Chưa có tag nào trong hệ thống"
        >
          <DataTable
            data={tags}
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

      {/* Tag Form Modal */}
      <TagForm
        visible={formVisible}
        tag={selectedTag}
        isEditing={isEditing}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />

      {/* Confirm Modal */}
      <ConfirmModal {...modalProps} />
    </div>
  )
}

export default TagsList
