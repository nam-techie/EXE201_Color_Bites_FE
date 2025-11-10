import {
    CommentOutlined,
    DeleteOutlined,
    EyeOutlined,
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
import { commentsApi } from '../../services/commentsApi'
import type { Comment } from '../../types/comment'
import { formatDate, truncateText } from '../../utils/formatters'
import CommentDetail from './CommentDetail.tsx'


const CommentsList: React.FC = () => {
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [detailVisible, setDetailVisible] = useState(false)
  const { confirm, modalProps } = useConfirm()

  // Data table hook
  const {
    data: comments,
    loading,
    isRefreshing,
    error,
    pagination,
    filters,
    refresh,
    setPage,
    setPageSize,
    setFilters
  } = useDataTable<Comment>({
    fetchData: async (page, size, filters) => {
      const response = await commentsApi.getComments({
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
      search: ''
    }
  })

  // Table columns
  const columns: DataTableColumn<Comment>[] = [
    {
      key: 'id',
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      render: (id: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
          {id ? id.slice(0, 8) + '...' : 'N/A'}
        </span>
      )
    },
    {
      key: 'content',
      title: 'Nội dung',
      dataIndex: 'content',
      render: (content: string) => (
        <div style={{ maxWidth: 300 }}>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>
            {truncateText(content || 'N/A', 100)}
          </div>
        </div>
      )
    },
    {
      key: 'post',
      title: 'Bài viết',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, maxWidth: 200 }}>
            {record.post?.title || record.postId || 'N/A'}
          </div>
          {record.postId && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              ID: {record.postId.slice(0, 8)}...
            </div>
          )}
        </div>
      )
    },
    {
      key: 'user',
      title: 'Người dùng',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {record.user?.name || record.userId || 'N/A'}
          </div>
          {record.user?.email && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.user.email}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      title: 'Trạng thái',
      render: (_, record) => {
        const statusConfig: Record<string, { color: string; bg: string; text: string }> = {
          active: { color: '#52c41a', bg: '#f6ffed', text: 'Hoạt động' },
          hidden: { color: '#faad14', bg: '#fffbe6', text: 'Ẩn' },
          reported: { color: '#ff4d4f', bg: '#fff2f0', text: 'Báo cáo' }
        }
        
        const config = statusConfig[record.status] || { color: '#666', bg: '#f5f5f5', text: record.status || 'N/A' }
        
        return (
          <span style={{
            padding: '2px 8px',
            borderRadius: '12px',
            backgroundColor: config.bg,
            color: config.color,
            fontSize: '12px',
            fontWeight: 500
          }}>
            {config.text}
          </span>
        )
      }
    },
    {
      key: 'createdAt',
      title: 'Ngày tạo',
      render: (_, record) => formatDate(record.createdAt, 'DD/MM/YYYY HH:mm')
    }
  ]

  // Table actions
  const actions: DataTableAction<Comment>[] = [
    {
      key: 'view',
      label: 'Xem',
      icon: <EyeOutlined />,
      type: 'link',
      onClick: (record) => {
        setSelectedComment(record)
        setDetailVisible(true)
      }
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: <DeleteOutlined />,
      type: 'link',
      danger: true,
      visible: (record) => record.status !== 'hidden',
      onClick: async (record) => {
        const confirmed = await confirm({
          title: 'Xóa bình luận',
          content: 'Bạn có chắc chắn muốn xóa bình luận này?',
          type: 'error'
        })
        
        if (confirmed) {
          try {
            await commentsApi.deleteComment(record.id)
            message.success('Xóa bình luận thành công')
            refresh()
          } catch (error) {
            message.error('Không thể xóa bình luận')
          }
        }
      }
    },
    {
      key: 'restore',
      label: 'Khôi phục',
      icon: <UndoOutlined />,
      type: 'link',
      visible: (record) => record.status === 'hidden',
      onClick: async (record) => {
        const confirmed = await confirm({
          title: 'Khôi phục bình luận',
          content: 'Bạn có chắc chắn muốn khôi phục bình luận này?',
          type: 'info'
        })
        
        if (confirmed) {
          try {
            await commentsApi.restoreComment(record.id)
            message.success('Khôi phục bình luận thành công')
            refresh()
          } catch (error) {
            message.error('Không thể khôi phục bình luận')
          }
        }
      }
    },
  ]

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value })
  }

  const handleReset = () => {
    setFilters({ search: '' })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <CommentOutlined className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý bình luận</h1>
            <p className="text-gray-600">Quản lý tất cả bình luận trong hệ thống</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Tìm kiếm theo nội dung, người dùng..."
        searchValue={filters.search}
        onSearch={handleSearch}
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
          empty={!loading && comments.length === 0}
          emptyText="Không có bình luận nào"
          emptyDescription="Chưa có bình luận nào trong hệ thống"
        >
          <DataTable
            data={comments}
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

      {/* Comment Detail Drawer */}
      <Drawer
        title="Chi tiết bình luận"
        placement="right"
        width={600}
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        destroyOnClose
      >
        {selectedComment && (
          <CommentDetail 
            comment={selectedComment} 
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

export default CommentsList
