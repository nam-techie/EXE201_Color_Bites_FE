import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  EyeOutlined
} from '@ant-design/icons'
import { Card, Col, Image, message, Modal, Row, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import ConfirmModal from '../../components/common/ConfirmModal'
import DataTable, { DataTableAction, DataTableColumn } from '../../components/common/DataTable'
import FilterBar from '../../components/common/FilterBar'
import LoadingState from '../../components/common/LoadingState'
import { useConfirm } from '../../hooks/useConfirm'
import { useDataTable } from '../../hooks/useDataTable'
import { challengesApi } from '../../services/challengesApi'
import type { Challenge, ChallengeEntry, EntryStatus } from '../../types/challenge'
import { ENTRY_STATUS_CONFIG } from '../../types/challenge'
import { formatDate } from '../../utils/formatters'

interface ChallengeEntriesProps {
   challengeId?: string
   challengeTitle?: string
   // Nếu không có challengeId, hiển thị tất cả entries pending cho admin duyệt
   showAllPending?: boolean
}

const ChallengeEntries: React.FC<ChallengeEntriesProps> = ({
   challengeId,
   challengeTitle,
   showAllPending = false
}) => {
   const [challenge, setChallenge] = useState<Challenge | null>(null)
   const [selectedEntry, setSelectedEntry] = useState<ChallengeEntry | null>(null)
   const [detailVisible, setDetailVisible] = useState(false)
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
      fetchData: async (page, size, currentFilters) => {
         // Nếu showAllPending, lấy tất cả entries pending
         if (showAllPending || currentFilters?.status) {
            const status = currentFilters?.status || 'PENDING'
            const response = await challengesApi.getEntriesByStatus(status as EntryStatus, {
               page: page - 1,
               size: size
            })
            return {
               data: response.data.content,
               total: response.data.totalElements,
               page: response.data.number + 1,
               size: response.data.size
            }
         }
         // Nếu có challengeId, không lấy gì (vì không có API phù hợp)
         return {
            data: [],
            total: 0,
            page: 1,
            size: size
         }
      },
      initialFilters: {
         search: '',
         status: showAllPending ? 'PENDING' : undefined
      }
   })

   // Load challenge details if challengeId is provided
   useEffect(() => {
      if (challengeId) {
         const loadChallenge = async () => {
            try {
               const response = await challengesApi.getChallengeById(challengeId)
               setChallenge(response.data)
            } catch (error) {
               console.error('Error loading challenge:', error)
            }
         }
         loadChallenge()
      }
   }, [challengeId])

   // Handle approve entry
   const handleApprove = async (entry: ChallengeEntry) => {
      const confirmed = await confirm({
         title: 'Duyệt bài nộp',
         content: `Bạn có chắc chắn muốn duyệt bài nộp này?`,
         type: 'info'
      })

      if (confirmed) {
         try {
            await challengesApi.approveEntry(entry.id)
            message.success('Duyệt bài nộp thành công')
            refresh()
         } catch (error) {
            message.error('Không thể duyệt bài nộp')
         }
      }
   }

   // Handle reject entry
   const handleReject = async (entry: ChallengeEntry) => {
      const confirmed = await confirm({
         title: 'Từ chối bài nộp',
         content: `Bạn có chắc chắn muốn từ chối bài nộp này?`,
         type: 'warning'
      })

      if (confirmed) {
         try {
            await challengesApi.rejectEntry(entry.id)
            message.success('Từ chối bài nộp thành công')
            refresh()
         } catch (error) {
            message.error('Không thể từ chối bài nộp')
         }
      }
   }

   // Handle delete entry
   const handleDelete = async (entry: ChallengeEntry) => {
      const confirmed = await confirm({
         title: 'Xóa bài nộp',
         content: `Bạn có chắc chắn muốn xóa bài nộp này? Hành động này không thể hoàn tác.`,
         type: 'error'
      })

      if (confirmed) {
         try {
            await challengesApi.deleteEntry(entry.id)
            message.success('Xóa bài nộp thành công')
            refresh()
         } catch (error) {
            message.error('Không thể xóa bài nộp')
         }
      }
   }

   // View entry detail
   const handleViewDetail = (entry: ChallengeEntry) => {
      setSelectedEntry(entry)
      setDetailVisible(true)
   }

   // Table columns
   const columns: DataTableColumn<ChallengeEntry>[] = [
      {
         key: 'id',
         title: 'ID',
         dataIndex: 'id',
         width: 100,
         render: (id: string) => (
            <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
               {id.slice(0, 8)}...
            </span>
         )
      },
      {
         key: 'challenge',
         title: 'Thử thách',
         render: (_, record) => (
            <div>
               <div className="font-medium text-gray-900">
                  {record.challengeTitle || 'N/A'}
               </div>
            </div>
         )
      },
      {
         key: 'restaurant',
         title: 'Nhà hàng',
         render: (_, record) => (
            <div>
               <div className="font-medium text-gray-900">
                  {record.restaurantName || 'N/A'}
               </div>
               {record.restaurantId && (
                  <div className="text-xs text-gray-500">
                     ID: {record.restaurantId.slice(0, 8)}...
                  </div>
               )}
            </div>
         )
      },
      {
         key: 'photo',
         title: 'Ảnh',
         width: 100,
         render: (_, record) => (
            record.photoUrl ? (
               <Image
                  src={record.photoUrl}
                  alt="Entry photo"
                  width={60}
                  height={60}
                  className="rounded object-cover"
               />
            ) : (
               <div className="w-15 h-15 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                  No image
               </div>
            )
         )
      },
      {
         key: 'caption',
         title: 'Mô tả',
         render: (_, record) => (
            <div className="max-w-xs">
               <div className="text-sm text-gray-900 line-clamp-2">
                  {record.caption || '-'}
               </div>
            </div>
         )
      },
      {
         key: 'location',
         title: 'Vị trí',
         render: (_, record) => (
            <div className="flex items-center space-x-1 text-sm text-gray-600">
               <EnvironmentOutlined />
               <span>
                  {record.latitude?.toFixed(4)}, {record.longitude?.toFixed(4)}
               </span>
            </div>
         )
      },
      {
         key: 'status',
         title: 'Trạng thái',
         width: 120,
         render: (_, record) => {
            const config = ENTRY_STATUS_CONFIG[record.status] || {
               label: record.status,
               color: 'default'
            }

            return (
               <Tag color={config.color} style={{ fontWeight: 500 }}>
                  {config.label}
               </Tag>
            )
         }
      },
      {
         key: 'createdAt',
         title: 'Ngày nộp',
         width: 150,
         render: (_, record) => formatDate(record.createdAt, 'DD/MM/YYYY HH:mm')
      }
   ]

   // Table actions
   const actions: DataTableAction<ChallengeEntry>[] = [
      {
         key: 'view',
         label: 'Xem chi tiết',
         icon: <EyeOutlined />,
         type: 'link',
         onClick: handleViewDetail
      },
      {
         key: 'approve',
         label: 'Duyệt',
         icon: <CheckOutlined />,
         type: 'link',
         visible: (record) => record.status === 'PENDING',
         onClick: handleApprove
      },
      {
         key: 'reject',
         label: 'Từ chối',
         icon: <CloseOutlined />,
         type: 'link',
         danger: true,
         visible: (record) => record.status === 'PENDING',
         onClick: handleReject
      },
      {
         key: 'delete',
         label: 'Xóa',
         icon: <DeleteOutlined />,
         type: 'link',
         danger: true,
         onClick: handleDelete
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
      setFilters({ search: '', status: showAllPending ? 'PENDING' : undefined })
   }

   return (
      <div className="space-y-6">
         {/* Page Header */}
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-2xl font-bold text-gray-900">
                  {showAllPending ? 'Duyệt bài nộp thử thách' : 'Bài nộp thử thách'}
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
                           {challenge.participantCount || 0}
                        </div>
                        <div className="text-sm text-gray-500">Người tham gia</div>
                     </div>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                     <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                           {challenge.targetCount || 0}
                        </div>
                        <div className="text-sm text-gray-500">Mục tiêu</div>
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
            searchPlaceholder="Tìm kiếm theo nhà hàng, mô tả..."
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
               emptyDescription={showAllPending ? "Không có bài nộp nào đang chờ duyệt" : "Chưa có bài nộp nào cho thử thách này"}
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
                  scroll={{ x: 1400 }}
               />
            </LoadingState>
         </Card>

         {/* Entry Detail Modal */}
         <Modal
            title="Chi tiết bài nộp"
            open={detailVisible}
            onCancel={() => setDetailVisible(false)}
            footer={null}
            width={600}
         >
            {selectedEntry && (
               <div className="space-y-4">
                  {selectedEntry.photoUrl && (
                     <div className="text-center">
                        <Image
                           src={selectedEntry.photoUrl}
                           alt="Entry photo"
                           className="rounded max-h-64 object-contain"
                        />
                     </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <div className="text-sm text-gray-500">Thử thách</div>
                        <div className="font-medium">{selectedEntry.challengeTitle || 'N/A'}</div>
                     </div>
                     <div>
                        <div className="text-sm text-gray-500">Nhà hàng</div>
                        <div className="font-medium">{selectedEntry.restaurantName || 'N/A'}</div>
                     </div>
                     <div>
                        <div className="text-sm text-gray-500">Trạng thái</div>
                        <Tag color={ENTRY_STATUS_CONFIG[selectedEntry.status]?.color} style={{ fontWeight: 500 }}>
                           {ENTRY_STATUS_CONFIG[selectedEntry.status]?.label || selectedEntry.status}
                        </Tag>
                     </div>
                     <div>
                        <div className="text-sm text-gray-500">Ngày nộp</div>
                        <div className="font-medium">
                           {formatDate(selectedEntry.createdAt, 'DD/MM/YYYY HH:mm')}
                        </div>
                     </div>
                     <div className="col-span-2">
                        <div className="text-sm text-gray-500">Vị trí</div>
                        <div className="font-medium flex items-center space-x-1">
                           <EnvironmentOutlined />
                           <span>
                              {selectedEntry.latitude?.toFixed(6)}, {selectedEntry.longitude?.toFixed(6)}
                           </span>
                        </div>
                     </div>
                     {selectedEntry.caption && (
                        <div className="col-span-2">
                           <div className="text-sm text-gray-500">Mô tả</div>
                           <div className="font-medium">{selectedEntry.caption}</div>
                        </div>
                     )}
                  </div>

                  {selectedEntry.status === 'PENDING' && (
                     <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                           onClick={() => {
                              setDetailVisible(false)
                              handleReject(selectedEntry)
                           }}
                           className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50"
                        >
                           Từ chối
                        </button>
                        <button
                           onClick={() => {
                              setDetailVisible(false)
                              handleApprove(selectedEntry)
                           }}
                           className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                           Duyệt
                        </button>
                     </div>
                  )}
               </div>
            )}
         </Modal>

         {/* Confirm Modal */}
         <ConfirmModal {...modalProps} />
      </div>
   )
}

export default ChallengeEntries
