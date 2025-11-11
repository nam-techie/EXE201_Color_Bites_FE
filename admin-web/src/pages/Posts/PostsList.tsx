import {
    DeleteOutlined,
    EyeOutlined,
    FileTextOutlined,
    UndoOutlined
} from '@ant-design/icons'
import { Download } from 'lucide-react'
import { Card, Drawer, message } from 'antd'
import React, { useState } from 'react'
import ConfirmModal from '../../components/common/ConfirmModal'
import DataTable, { DataTableAction, DataTableColumn } from '../../components/common/DataTable'
import FilterBar from '../../components/common/FilterBar'
import LoadingState from '../../components/common/LoadingState'
import { useConfirm } from '../../hooks/useConfirm'
import { useDataTable } from '../../hooks/useDataTable'
import { postsApi } from '../../services/postsApi'
import type { PostResponse } from '../../types/post'
import { exportPostsToExcel } from '../../utils/export'
import { displayNumber, displayValue, formatDate, truncateText } from '../../utils/formatters'
import PostDetail from './PostDetail'

const PostsList: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<PostResponse | null>(null)
  const [detailVisible, setDetailVisible] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const { confirm, modalProps } = useConfirm()

  // Data table hook
  const {
    data: posts,
    loading,
    isRefreshing,
    error,
    pagination,
    filters,
    refresh,
    setPage,
    setPageSize,
    setFilters
  } = useDataTable<PostResponse>({
    fetchData: async (page, size, filters) => {
      const response = await postsApi.getPosts(page - 1, size, filters)
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
  const columns: DataTableColumn<PostResponse>[] = [
    {
      key: 'content',
      title: 'Nội dung',
      dataIndex: 'content',
      render: (content: string) => (
        <div style={{ maxWidth: 300 }}>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>
            {displayValue(truncateText(content, 100))}
          </div>
        </div>
      )
    },
    {
      key: 'author',
      title: 'Tác giả',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{displayValue(record.accountName)}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {displayValue(record.authorEmail)}
          </div>
        </div>
      )
    },
    {
      key: 'mood',
      title: 'Tâm trạng',
      render: (_, record) => (
        <span style={{ 
          padding: '2px 8px', 
          borderRadius: '12px', 
          backgroundColor: '#f0f0f0',
          fontSize: '12px'
        }}>
          {displayValue(record.moodName, 'Chưa có tâm trạng')}
        </span>
      )
    },
    {
      key: 'stats',
      title: 'Thống kê',
      render: (_, record) => (
        <div style={{ fontSize: '12px' }}>
          <div>❤️ {displayNumber(record.reactionCount, '0')}</div>
          <div>💬 {displayNumber(record.commentCount, '0')}</div>
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
          backgroundColor: record.isDeleted ? '#ff4d4f' : '#52c41a',
          color: 'white',
          fontSize: '12px'
        }}>
          {record.isDeleted ? 'Đã xóa' : 'Hoạt động'}
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
  const actions: DataTableAction<PostResponse>[] = [
    {
      key: 'view',
      label: 'Xem',
      icon: <EyeOutlined />,
      type: 'link',
      onClick: (record) => {
        setSelectedPost(record)
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
          title: 'Xóa bài viết',
          content: 'Bạn có chắc chắn muốn xóa bài viết này?',
          type: 'warning'
        })
        
        if (confirmed) {
          try {
            await postsApi.deletePost(record.id)
            message.success('Xóa bài viết thành công')
            refresh()
          } catch (error) {
            message.error('Không thể xóa bài viết')
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
          title: 'Khôi phục bài viết',
          content: 'Bạn có chắc chắn muốn khôi phục bài viết này?',
          type: 'info'
        })
        
        if (confirmed) {
          try {
            await postsApi.restorePost(record.id)
            message.success('Khôi phục bài viết thành công')
            refresh()
          } catch (error) {
            message.error('Không thể khôi phục bài viết')
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
        { key: 'deleted', label: 'Đã xóa', value: 'deleted' }
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
    setFilters({ search: '', status: 'all' })
  }

  const handleExport = async () => {
    setExportLoading(true)
    try {
      const response = await postsApi.getPosts(0, 10000)
      await exportPostsToExcel(response.data.content)
      message.success(`Đã xuất ${response.data.content.length} bài viết ra file Excel`)
    } catch (error) {
      console.error('Error exporting posts:', error)
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
            <FileTextOutlined className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý bài viết</h1>
            <p className="text-gray-600">Quản lý tất cả bài viết trong hệ thống</p>
          </div>
        </div>
        <button
          onClick={handleExport}
          disabled={exportLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>{exportLoading ? 'Đang xuất...' : 'Xuất Excel'}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Tìm kiếm theo nội dung, tác giả..."
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
          isRefreshing={isRefreshing}
          error={error}
          empty={!loading && posts.length === 0}
          emptyText="Không có bài viết nào"
          emptyDescription="Chưa có bài viết nào trong hệ thống"
        >
          <DataTable
            data={posts}
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

      {/* Post Detail Drawer */}
      <Drawer
        title="Chi tiết bài viết"
        placement="right"
        width={600}
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        destroyOnClose
      >
        {selectedPost && (
          <PostDetail 
            post={selectedPost} 
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

export default PostsList
