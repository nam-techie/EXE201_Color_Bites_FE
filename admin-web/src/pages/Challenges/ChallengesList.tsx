import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  PoweroffOutlined,
  TrophyOutlined
} from '@ant-design/icons'
import { Button, Card, message, Tag } from 'antd'
import { Download } from 'lucide-react'
import React, { useState } from 'react'
import ConfirmModal from '../../components/common/ConfirmModal'
import DataTable, { DataTableAction, DataTableColumn } from '../../components/common/DataTable'
import FilterBar from '../../components/common/FilterBar'
import LoadingState from '../../components/common/LoadingState'
import { useConfirm } from '../../hooks/useConfirm'
import { useDataTable } from '../../hooks/useDataTable'
import { challengesApi } from '../../services/challengesApi'
import type { Challenge } from '../../types/challenge'
import { CHALLENGE_STATUS_CONFIG, CHALLENGE_TYPE_CONFIG } from '../../types/challenge'
import { exportChallengesToExcel } from '../../utils/export'
import { formatDate, formatNumber } from '../../utils/formatters'
import ChallengeForm from './ChallengeForm'

const ChallengesList: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [formVisible, setFormVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const { confirm, modalProps } = useConfirm()

  // Data table hook
  const {
    data: challenges,
    loading,
    error,
    pagination,
    filters,
    refresh,
    setPage,
    setPageSize,
    setFilters
  } = useDataTable<Challenge>({
    fetchData: async (page, size, filters) => {
      try {
        const response = await challengesApi.getChallenges({
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
      } catch (error: any) {
        // Nếu là lỗi 403, hiển thị message rõ ràng
        if (error.response?.status === 403) {
          message.error('Bạn không có quyền truy cập danh sách challenges. Vui lòng kiểm tra quyền của tài khoản.')
        }
        throw error
      }
    },
    initialFilters: {
      search: '',
      challengeType: undefined,
      status: undefined,
      sortBy: 'createdAt',
      order: 'desc'
    }
  })

  // Table columns
  const columns: DataTableColumn<Challenge>[] = [
    {
      key: 'title',
      title: 'Tiêu đề',
      dataIndex: 'title',
      render: (title: string, record: Challenge) => (
        <div>
          <div className="font-medium text-gray-900">{title}</div>
          <div className="text-sm text-gray-500 mt-1">
            {record.description && record.description.length > 80 
              ? `${record.description.slice(0, 80)}...` 
              : record.description}
          </div>
        </div>
      )
    },
    {
      key: 'challengeType',
      title: 'Loại',
      render: (_, record) => {
        const config = CHALLENGE_TYPE_CONFIG[record.challengeType] || { label: record.challengeType || 'N/A', color: 'default' }
        return (
          <div className="flex items-center space-x-2">
            <span className="font-medium">{config.label}</span>
          </div>
        )
      }
    },
    {
      key: 'status',
      title: 'Trạng thái',
      width: 140,
      render: (_, record) => {
        const config = CHALLENGE_STATUS_CONFIG[record.status] || { 
          label: record.isActive ? 'Hoạt động' : 'Chưa kích hoạt', 
          color: record.isActive ? 'green' : 'orange'
        }
        return (
          <Tag color={config.color} style={{ fontWeight: 500 }}>
            {config.label}
          </Tag>
        )
      }
    },
    {
      key: 'participants',
      title: 'Tham gia',
      render: (_, record) => (
        <div className="text-center">
          <div className="font-medium text-blue-600">
            {formatNumber(record.participantCount || 0)} người
          </div>
          {record.targetCount && (
            <div className="text-xs text-gray-500">
              Mục tiêu: {formatNumber(record.targetCount)} bài
            </div>
          )}
        </div>
      )
    },
    {
      key: 'restaurant',
      title: 'Nhà hàng',
      render: (_, record) => (
        <div>
          {record.restaurantName ? (
            <div className="text-sm">
              <div className="font-medium text-gray-900">{record.restaurantName}</div>
              {record.restaurantId && (
                <div className="text-xs text-gray-500 mt-1">
                  ID: {record.restaurantId.slice(0, 8)}...
                </div>
              )}
            </div>
          ) : (
            <span className="text-gray-400 text-sm">N/A</span>
          )}
        </div>
      )
    },
    {
      key: 'dates',
      title: 'Thời gian',
      render: (_, record) => (
        <div className="text-sm">
          <div className="text-gray-900">
            Bắt đầu: {formatDate(record.startDate, 'DD/MM/YYYY')}
          </div>
          <div className="text-gray-500">
            Kết thúc: {formatDate(record.endDate, 'DD/MM/YYYY')}
          </div>
        </div>
      )
    }
  ]

  // Table actions
  const actions: DataTableAction<Challenge>[] = [
    {
      key: 'view',
      label: 'Xem',
      icon: <EyeOutlined />,
      type: 'link',
      onClick: (record) => {
        setSelectedChallenge(record)
        setIsEditing(false)
        setFormVisible(true)
      }
    },
    {
      key: 'edit',
      label: 'Chỉnh sửa',
      icon: <EditOutlined />,
      type: 'link',
      onClick: (record) => {
        setSelectedChallenge(record)
        setIsEditing(true)
        setFormVisible(true)
      }
    },
    {
      key: 'activate',
      label: 'Kích hoạt',
      icon: <PoweroffOutlined />,
      type: 'link',
      visible: (record) => record.status === 'INACTIVE',
      onClick: async (record) => {
        const confirmed = await confirm({
          title: 'Kích hoạt thử thách',
          content: `Bạn có chắc chắn muốn kích hoạt thử thách "${record.title}"?`,
          type: 'info'
        })
        
        if (confirmed) {
          try {
            await challengesApi.activateChallenge(record.id)
            message.success('Kích hoạt thử thách thành công')
            refresh()
          } catch (error) {
            message.error('Không thể kích hoạt thử thách')
          }
        }
      }
    },
    {
      key: 'deactivate',
      label: 'Vô hiệu hóa',
      icon: <PoweroffOutlined />,
      type: 'link',
      visible: (record) => record.status === 'ACTIVE',
      onClick: async (record) => {
        const confirmed = await confirm({
          title: 'Vô hiệu hóa thử thách',
          content: `Bạn có chắc chắn muốn vô hiệu hóa thử thách "${record.title}"?`,
          type: 'warning'
        })
        
        if (confirmed) {
          try {
            await challengesApi.deactivateChallenge(record.id)
            message.success('Vô hiệu hóa thử thách thành công')
            refresh()
          } catch (error) {
            message.error('Không thể vô hiệu hóa thử thách')
          }
        }
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
          title: 'Xóa thử thách',
          content: `Bạn có chắc chắn muốn xóa thử thách "${record.title}"?`,
          type: 'error'
        })
        
        if (confirmed) {
          try {
            await challengesApi.deleteChallenge(record.id)
            message.success('Xóa thử thách thành công')
            refresh()
          } catch (error) {
            message.error('Không thể xóa thử thách')
          }
        }
      }
    }
  ]

  // Filter options
  const filterOptions = [
    {
      key: 'challengeType',
      label: 'Loại',
      options: [
        { key: 'all', label: 'Tất cả', value: undefined },
        { key: 'PARTNER_LOCATION', label: 'Check-in tại nhà hàng', value: 'PARTNER_LOCATION' },
        { key: 'THEME_COUNT', label: 'Ăn theo chủ đề', value: 'THEME_COUNT' }
      ],
      value: filters.challengeType,
      onChange: (value: string) => {
        setFilters({ ...filters, challengeType: value as any })
      }
    },
    {
      key: 'status',
      label: 'Trạng thái',
      options: [
        { key: 'all', label: 'Tất cả', value: undefined },
        { key: 'ACTIVE', label: 'Hoạt động', value: 'ACTIVE' },
        { key: 'INACTIVE', label: 'Không hoạt động', value: 'INACTIVE' },
        { key: 'COMPLETED', label: 'Hoàn thành', value: 'COMPLETED' },
        { key: 'CANCELLED', label: 'Đã hủy', value: 'CANCELLED' }
      ],
      value: filters.status,
      onChange: (value: string) => {
        setFilters({ ...filters, status: value as any })
      }
    },
    {
      key: 'sortBy',
      label: 'Sắp xếp theo',
      options: [
        { key: 'title', label: 'Tiêu đề', value: 'title' },
        { key: 'participantCount', label: 'Số người tham gia', value: 'participantCount' },
        { key: 'startDate', label: 'Ngày bắt đầu', value: 'startDate' },
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
    setFilters({ search: '', challengeType: undefined, status: undefined, sortBy: 'createdAt', order: 'desc' })
  }

  const handleCreateChallenge = () => {
    setSelectedChallenge(null)
    setIsEditing(false)
    setFormVisible(true)
  }

  const handleFormClose = () => {
    setFormVisible(false)
    setSelectedChallenge(null)
    setIsEditing(false)
  }

  const handleFormSubmit = () => {
    handleFormClose()
    refresh()
  }

  const handleExport = async () => {
    setExportLoading(true)
    try {
      const response = await challengesApi.getChallenges({ page: 0, size: 10000 })
      const challenges = response.data.content || []
      await exportChallengesToExcel(challenges)
      message.success(`Đã xuất ${challenges.length} thử thách ra file Excel`)
    } catch (error) {
      console.error('Error exporting challenges:', error)
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
            <TrophyOutlined className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý thử thách</h1>
            <p className="text-gray-600">Quản lý tất cả thử thách trong hệ thống</p>
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
            onClick={handleCreateChallenge}
          >
            Tạo thử thách mới
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Tìm kiếm theo tiêu đề, mô tả..."
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
          empty={!loading && challenges.length === 0}
          emptyText="Không có thử thách nào"
          emptyDescription="Chưa có thử thách nào trong hệ thống"
        >
          <DataTable
            data={challenges}
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

      {/* Challenge Form Modal */}
      <ChallengeForm
        visible={formVisible}
        challenge={selectedChallenge}
        isEditing={isEditing}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />

      {/* Confirm Modal */}
      <ConfirmModal {...modalProps} />
    </div>
  )
}

export default ChallengesList
