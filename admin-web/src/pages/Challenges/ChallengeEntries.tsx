import {
    CheckOutlined,
    CloseOutlined,
    EyeOutlined,
    UserOutlined
} from '@ant-design/icons'
import { Button, Card, Col, Image, message, Row, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import ConfirmModal from '../../components/common/ConfirmModal'
import DataTable, { DataTableAction, DataTableColumn } from '../../components/common/DataTable'
import FilterBar from '../../components/common/FilterBar'
import LoadingState from '../../components/common/LoadingState'
import { useConfirm } from '../../hooks/useConfirm'
import { useDataTable } from '../../hooks/useDataTable'
import { challengesApi } from '../../services/challengesApi'
import type { Challenge, ChallengeEntry } from '../../types/challenge'
import { formatDate } from '../../utils/formatters'

interface ChallengeEntriesProps {
  challengeId: string
  challengeTitle?: string
}

const ChallengeEntries: React.FC<ChallengeEntriesProps> = ({
  challengeId,
  challengeTitle
}) => {
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const { confirm, modalProps } = useConfirm()

  // Data table hook
  const {
    data: entries,
    loading,
    error,
    pagination,
    filters,
    refresh,
    setPage,
    setPageSize,
    setFilters
  } = useDataTable<ChallengeEntry>({
    fetchData: async (page, size, filters) => {
      const response = await challengesApi.getChallengeEntries(challengeId, {
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
      status: undefined
    }
  })

  // Load challenge details
  useEffect(() => {
    const loadChallenge = async () => {
      try {
        const response = await challengesApi.getChallengeById(challengeId)
        setChallenge(response.data)
      } catch (error) {
        console.error('Error loading challenge:', error)
      }
    }
    loadChallenge()
  }, [challengeId])

  // Table columns
  const columns: DataTableColumn<ChallengeEntry>[] = [
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
      key: 'user',
      title: 'Người nộp',
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <UserOutlined className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{record.userName}</div>
            <div className="text-sm text-gray-500">{record.userEmail}</div>
          </div>
        </div>
      )
    },
    {
      key: 'content',
      title: 'Nội dung',
      render: (_, record) => (
        <div className="max-w-xs">
          <div className="text-sm text-gray-900 line-clamp-2">
            {record.content}
          </div>
          {record.images && record.images.length > 0 && (
            <div className="mt-2 flex space-x-1">
              {record.images.slice(0, 3).map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`Image ${index + 1}`}
                  width={40}
                  height={40}
                  className="rounded object-cover"
                />
              ))}
              {record.images.length > 3 && (
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                  +{record.images.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      title: 'Trạng thái',
      render: (_, record) => {
        const statusConfig = {
          PENDING: { color: 'orange', text: 'Chờ duyệt' },
          APPROVED: { color: 'green', text: 'Đã duyệt' },
          REJECTED: { color: 'red', text: 'Từ chối' }
        }
        const config = statusConfig[record.status]
        
        return (
          <Tag color={config.color}>
            {config.text}
          </Tag>
        )
      }
    },
    {
      key: 'submittedAt',
      title: 'Ngày nộp',
      render: (_, record) => formatDate(record.submittedAt, 'DD/MM/YYYY HH:mm')
    },
    {
      key: 'reviewedAt',
      title: 'Ngày duyệt',
      render: (_, record) => record.reviewedAt 
        ? formatDate(record.reviewedAt, 'DD/MM/YYYY HH:mm')
        : '-'
    }
  ]

  // Table actions
  const actions: DataTableAction<ChallengeEntry>[] = [
    {
      key: 'view',
      label: 'Xem chi tiết',
      icon: <EyeOutlined />,
      type: 'link',
      onClick: (record) => {
        // TODO: Implement view details modal
        message.info('Tính năng xem chi tiết sẽ được triển khai')
      }
    },
    {
      key: 'approve',
      label: 'Duyệt',
      icon: <CheckOutlined />,
      type: 'link',
      visible: (record) => record.status === 'PENDING',
      onClick: async (record) => {
        const confirmed = await confirm({
          title: 'Duyệt bài nộp',
          content: `Bạn có chắc chắn muốn duyệt bài nộp này?`,
          type: 'info'
        })
        
        if (confirmed) {
          try {
            await challengesApi.approveEntry(record.id)
            message.success('Duyệt bài nộp thành công')
            refresh()
          } catch (error) {
            message.error('Không thể duyệt bài nộp')
          }
        }
      }
    },
    {
      key: 'reject',
      label: 'Từ chối',
      icon: <CloseOutlined />,
      type: 'link',
      danger: true,
      visible: (record) => record.status === 'PENDING',
      onClick: async (record) => {
        const confirmed = await confirm({
          title: 'Từ chối bài nộp',
          content: `Bạn có chắc chắn muốn từ chối bài nộp này?`,
          type: 'warning'
        })
        
        if (confirmed) {
          try {
            await challengesApi.rejectEntry(record.id)
            message.success('Từ chối bài nộp thành công')
            refresh()
          } catch (error) {
            message.error('Không thể từ chối bài nộp')
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
        { key: 'all', label: 'Tất cả', value: undefined },
        { key: 'PENDING', label: 'Chờ duyệt', value: 'PENDING' },
        { key: 'APPROVED', label: 'Đã duyệt', value: 'APPROVED' },
        { key: 'REJECTED', label: 'Từ chối', value: 'REJECTED' }
      ],
      value: filters.status,
      onChange: (value: string) => {
        setFilters({ ...filters, status: value as any })
      }
    }
  ]

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value })
  }

  const handleReset = () => {
    setFilters({ search: '', status: undefined })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bài nộp thử thách
          </h1>
          {challengeTitle && (
            <p className="text-gray-600 mt-1">
              Thử thách: {challengeTitle}
            </p>
          )}
        </div>
      </div>

      {/* Challenge Info */}
      {challenge && (
        <Card>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {challenge.participantCount}
                </div>
                <div className="text-sm text-gray-500">Người tham gia</div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {challenge.completionCount}
                </div>
                <div className="text-sm text-gray-500">Hoàn thành</div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {entries.filter(entry => entry.status === 'PENDING').length}
                </div>
                <div className="text-sm text-gray-500">Chờ duyệt</div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {entries.filter(entry => entry.status === 'APPROVED').length}
                </div>
                <div className="text-sm text-gray-500">Đã duyệt</div>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Tìm kiếm theo tên người dùng, nội dung..."
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
          empty={!loading && entries.length === 0}
          emptyText="Không có bài nộp nào"
          emptyDescription="Chưa có bài nộp nào cho thử thách này"
        >
          <DataTable
            data={entries}
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

      {/* Confirm Modal */}
      <ConfirmModal {...modalProps} />
    </div>
  )
}

export default ChallengeEntries
