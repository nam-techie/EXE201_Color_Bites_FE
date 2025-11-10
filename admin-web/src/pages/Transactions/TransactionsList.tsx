import {
    CreditCardOutlined,
    DownloadOutlined,
    EyeOutlined,
    ReloadOutlined
} from '@ant-design/icons'
import { Button, Card, Col, message, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import ConfirmModal from '../../components/common/ConfirmModal'
import DataTable, { DataTableAction, DataTableColumn } from '../../components/common/DataTable'
import FilterBar from '../../components/common/FilterBar'
import LoadingState from '../../components/common/LoadingState'
import StatCard from '../../components/common/StatCard'
import { useConfirm } from '../../hooks/useConfirm'
import { useDataTable } from '../../hooks/useDataTable'
import { transactionsApi } from '../../services/transactionsApi'
import type { Transaction, TransactionStats } from '../../types/transaction'
import { TRANSACTION_STATUS_CONFIG } from '../../types/transaction'
import { displayCurrency, displayNumber, displayValue, formatDate } from '../../utils/formatters'
import TransactionDetail from './TransactionDetail'

const TransactionsList: React.FC = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [detailVisible, setDetailVisible] = useState(false)
  const [stats, setStats] = useState<TransactionStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const { confirm, modalProps } = useConfirm()

  // Data table hook
  const {
    data: transactions,
    loading,
    error,
    pagination,
    filters,
    refresh,
    setPage,
    setPageSize,
    setFilters
  } = useDataTable<Transaction>({
    fetchData: async (page, size, filters) => {
      const response = await transactionsApi.getTransactions({
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
      status: undefined,
      type: undefined
    }
  })

  // Load stats on component mount
  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setStatsLoading(true)
    try {
      const statsData = await transactionsApi.getTransactionStats()
      setStats(statsData)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  // Table columns
  const columns: DataTableColumn<Transaction>[] = [
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
      key: 'user',
      title: 'Người dùng',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {displayValue(record.accountName)}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {displayValue(record.accountEmail || record.accountId)}
          </div>
        </div>
      )
    },
    {
      key: 'amount',
      title: 'Số tiền',
      render: (_, record) => (
        <div className="text-right">
          <div className="font-bold text-lg text-green-600">
            {displayCurrency(record.amount)} {displayValue(record.currency)}
          </div>
          <div className="text-xs text-gray-500">
            {displayValue(record.plan || 0)}
          </div>
        </div>
      )
    },
    {
      key: 'gateway',
      title: 'Cổng thanh toán',
      render: (_, record) => (
        <div>
          <div className="font-medium">{displayValue(record.gateway)}</div>
          <div className="text-xs text-gray-500">
            {displayValue(record.orderCode)}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Trạng thái',
      render: (_, record) => {
        const config = TRANSACTION_STATUS_CONFIG[record.status] || { 
          label: record.status || 'N/A', 
          color: 'default', 
          bgColor: '#f5f5f5', 
          textColor: '#8c8c8c' 
        }
        return (
          <span style={{
            padding: '4px 12px',
            borderRadius: '16px',
            backgroundColor: config.bgColor,
            color: config.textColor,
            fontSize: '12px',
            fontWeight: 500
          }}>
            {config.label}
          </span>
        )
      }
    },
    {
      key: 'providerTxnId',
      title: 'ID giao dịch',
      dataIndex: 'providerTxnId',
      render: (providerTxnId: string) => (
        <span className="text-gray-600 text-sm font-mono">
          {displayValue(providerTxnId ? providerTxnId.slice(0, 12) + '...' : null)}
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
  const actions: DataTableAction<Transaction>[] = [
    {
      key: 'view',
      label: 'Xem',
      icon: <EyeOutlined />,
      type: 'link',
      onClick: (record) => {
        setSelectedTransaction(record)
        setDetailVisible(true)
      }
    },
    {
      key: 'approve',
      label: 'Duyệt',
      icon: <ReloadOutlined />,
      type: 'link',
      visible: (record) => record.status === 'PENDING',
      onClick: async (record) => {
        const confirmed = await confirm({
          title: 'Duyệt giao dịch',
          content: 'Bạn có chắc chắn muốn duyệt giao dịch này?',
          type: 'info'
        })
        
        if (confirmed) {
          try {
            await transactionsApi.updateTransactionStatus(record.id, { status: 'SUCCESS' })
            message.success('Duyệt giao dịch thành công')
            refresh()
            loadStats() // Refresh stats
          } catch (error) {
            message.error('Không thể duyệt giao dịch')
          }
        }
      }
    },
    {
      key: 'reject',
      label: 'Từ chối',
      icon: <ReloadOutlined />,
      type: 'link',
      danger: true,
      visible: (record) => record.status === 'PENDING',
      onClick: async (record) => {
        const confirmed = await confirm({
          title: 'Từ chối giao dịch',
          content: 'Bạn có chắc chắn muốn từ chối giao dịch này?',
          type: 'warning'
        })
        
        if (confirmed) {
          try {
            await transactionsApi.updateTransactionStatus(record.id, { status: 'FAILED' })
            message.success('Từ chối giao dịch thành công')
            refresh()
            loadStats() // Refresh stats
          } catch (error) {
            message.error('Không thể từ chối giao dịch')
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
        { key: 'pending', label: 'Chờ xử lý', value: 'pending' },
        { key: 'completed', label: 'Hoàn thành', value: 'completed' },
        { key: 'failed', label: 'Thất bại', value: 'failed' },
        { key: 'cancelled', label: 'Đã hủy', value: 'cancelled' }
      ],
      value: filters.status,
      onChange: (value: string) => {
        setFilters({ ...filters, status: value as any })
      }
    },
    {
      key: 'type',
      label: 'Loại',
      options: [
        { key: 'all', label: 'Tất cả', value: undefined },
        { key: 'deposit', label: 'Nạp tiền', value: 'deposit' },
        { key: 'withdraw', label: 'Rút tiền', value: 'withdraw' },
        { key: 'reward', label: 'Thưởng', value: 'reward' },
        { key: 'refund', label: 'Hoàn tiền', value: 'refund' }
      ],
      value: filters.type,
      onChange: (value: string) => {
        setFilters({ ...filters, type: value as any })
      }
    }
  ]

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value })
  }

  const handleReset = () => {
    setFilters({ search: '', status: undefined, type: undefined })
  }

  const handleExport = () => {
    message.info('Tính năng xuất Excel sẽ được triển khai')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <CreditCardOutlined className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý giao dịch</h1>
            <p className="text-gray-600">Quản lý tất cả giao dịch trong hệ thống</p>
          </div>
        </div>
        <Button
          icon={<DownloadOutlined />}
          onClick={handleExport}
        >
          Xuất Excel
        </Button>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng doanh thu"
            value={displayCurrency(stats?.totalRevenue, '0')}
            icon=""
            color="#52c41a"
            loading={statsLoading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Số tiền chờ xử lý"
            value={displayCurrency(stats?.pendingAmount, '0')}
            icon=""
            color="#faad14"
            loading={statsLoading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Giao dịch thất bại"
            value={displayNumber(stats?.failedCount, '0')}
            icon=""
            color="#ff4d4f"
            loading={statsLoading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Giao dịch hoàn thành"
            value={displayNumber(stats?.completedCount, '0')}
            icon=""
            color="#52c41a"
            loading={statsLoading}
          />
        </Col>
      </Row>

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Tìm kiếm theo ID, người dùng..."
        searchValue={filters.search}
        onSearch={handleSearch}
        filters={filterOptions}
        onReset={handleReset}
        showExport={true}
        onExport={handleExport}
      />

      {/* Data Table */}
      <Card>
        <LoadingState
          loading={loading}
          error={error}
          empty={!loading && transactions.length === 0}
          emptyText="Không có giao dịch nào"
          emptyDescription="Chưa có giao dịch nào trong hệ thống"
        >
          <DataTable
            data={transactions}
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

      {/* Transaction Detail Drawer */}
      <TransactionDetail
        visible={detailVisible}
        transaction={selectedTransaction}
        onClose={() => setDetailVisible(false)}
        onUpdate={() => {
          refresh()
          loadStats()
        }}
      />

      {/* Confirm Modal */}
      <ConfirmModal {...modalProps} />
    </div>
  )
}

export default TransactionsList
